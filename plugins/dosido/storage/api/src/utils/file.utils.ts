import {Injectable} from "@nestjs/common";
import * as FS from 'graceful-fs';
import * as PATH from 'path';


@Injectable()
export class FileUtils {

    private constants = {
        DIRECTORY: 'folder',
        FILE: 'file'
    }

    private safeReadDirSync(path) {
        let dirData = [];
        try {
            dirData = FS.readdirSync(path);
        } catch (ex) {
            if (ex.code == "EACCES" || ex.code == "EPERM") {
                //User does not have permissions, ignore directory
                return null;
            } else throw ex;
        }
        return dirData;
    }

    /**
     * Normalizes windows style paths by replacing double backslahes with single forward slahes (unix style).
     * @param  {string} path
     * @return {string}
     */
    private normalizePath(path) {
        return path.replace(/\\/g, '/');
    }

    /**
     * Tests if the supplied parameter is of type RegExp
     * @param  {any}  regExp
     * @return {Boolean}
     */
    private isRegExp(regExp) {
        return typeof regExp === "object" && regExp.constructor == RegExp;
    }

    private permissionsConvert(mode) {
        return {
            'others': (mode & 1 ? 'x-' : '') + (mode & 2 ? 'w-' : '') + (mode & 4 ? 'r' : ''),
            'group': (mode & 10 ? 'x-' : '') + (mode & 20 ? 'w-' : '') + (mode & 40 ? 'r' : ''),
            'owner': (mode & 100 ? 'x-' : '') + (mode & 200 ? 'w-' : '') + (mode & 400 ? 'r' : '')
        }
    }

    /**
     * Collects the files and folders for a directory path into an Object, subject
     * to the options supplied, and invoking optional
     * @param  {String} path
     * @param  {Object} options
     * @param  {function} [onEachFile]
     * @param  {function} [onEachDirectory]
     * @param  {Object} [folderDepth]
     * @return {Object}
     */
    private directoryTree(path, options, onEachFile, onEachDirectory, folderDepth) {
        const name = PATH.basename(path);
        const item = {
            path,
            name,
            created: null,
            modified: null,
            type: null,
            id: null,
            premissions: null,
            size: null,
            extension: null,
            children: null
        };
        let stats;

        try {
            stats = FS.statSync(path);
        } catch (e) {
            return null;
        }

        if (options && options.exclude) {
            const excludes = this.isRegExp(options.exclude) ? [options.exclude] : options.exclude;
            if (excludes.some((exclusion) => exclusion.test(path))) {
                return null;
            }
        }
        item.created = stats.birthtime;
        item.modified = stats.mtime;
        item.type = this.constants.DIRECTORY;
        item.id = `${item.type}_${stats.ino}`;
        item.premissions = this.permissionsConvert(stats.mode);

        if (stats.isFile() && options.includeFiles) {

            const ext = PATH.extname(path).toLowerCase();
            if (options && options.extensions && !options.extensions.test(ext))
                return null;

            item.size = stats.size;  // size in bytes
            item.extension = ext;
            item.type = this.constants.FILE;


            if (options && options.attributes) {
                options.attributes.forEach((attribute) => {
                    item[attribute] = stats[attribute];
                });
            }

            if (onEachFile) {
                onEachFile(item, PATH, stats);
            }
        } else if (stats.isDirectory()) {

            const dirData = this.safeReadDirSync(path) || [];
            if (dirData === null) return null;

            if (options && options.attributes) {
                options.attributes.forEach((attribute) => {
                    item[attribute] = stats[attribute];
                });
            }

            if (!options.withChildren) {
                if (!folderDepth) {
                    item.children = dirData
                        .map(child => this.directoryTree(PATH.join(path, child), options, onEachFile, onEachDirectory, true))
                        .filter(e => !!e);
                    item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
                    if (onEachDirectory) {
                        onEachDirectory(item, PATH, stats);
                    }
                }

            } else {
                item.children = dirData
                    .map(child => this.directoryTree(PATH.join(path, child), options, onEachFile, onEachDirectory, false))
                    .filter(e => !!e);
                item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
                if (onEachDirectory) {
                    onEachDirectory(item, PATH, stats);
                }
            }
        } else {
            return null; // Or set item.size = 0 for devices, FIFO and sockets
        }
        item.path = options && options.normalizePath ?
            (options.removePath) ? this.normalizePath(item.path).replace(this.normalizePath(options.removePath), '') : this.normalizePath(item.path)
            : (options.removePath) ? item.path.replace(options.removePath, '') : item.path;
        return item;
    }

    private escapePath(path) {
        return (typeof path !== 'undefined' && path !== '' && !path.includes('..') && !path.includes('./')) ? path : '/tmp/';
    }

    private checkExtension(extension) {
        //TODO GET FROM ENV
        const allowedFiles = ['.jpg', '.png', '.gif', '.jpeg', '.svg', '.doc', '.txt', '.csv', '.docx', '.xls', '.xml', '.pdf', '.zip', '.ppt', '.mp4', '.ai', '.psd', '.mp3', '.avi'];
        if (!extension || !extension.length) {
            //allow directories
            return true;
        }
        return allowedFiles.indexOf(extension) > -1;
    }

    private checkVariables(variables) {
        let result = true;
        variables.forEach(element => {
            if (element === '' || element === undefined) {
                result = false;
            }
        });
        return result;
    }

}