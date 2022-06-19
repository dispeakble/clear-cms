import Layout from "../components/Layout";
import MaterialTable from "material-table";
import InvoiceIcon from "../assets/img/invoice/invoice-icon.svg"
import InvoiceBackground from "../assets/img/invoice/invoice-bg.png"


import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import {
    DownloadButton,
    InfoItem, InvoiceBg, InvoiceBgContainer,
    InvoiceImage,
    InvoiceImageContainer,
    InvoicePageWrapper,
    InvoiceRef,
    PriceText, TableContainer
} from "./styled"



const InvoicePage = ({ websiteName, colorScheme }: any) => {

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    };

    const breadcrumbs = {
        clientArea: "Client Area",
        invoice: "Invoice"
    }

    const dummy = [
        {
            invoice: {
                ref: "Invoice #3727382",
                infos: [
                    "Invoice for John Doe generated at 23. jun. 2022",
                    "2 x double bedroom in Hotel Victoria",
                    "bed and breakfast for:",
                    "2 x adults",
                    "2 x children"
                ]
            },
            price: "877.71 €",
            download: "download"
        },
        {
            invoice: {
                ref: "Invoice #3727382",
                infos: [
                    "Invoice for John Doe generated at 23. jun. 2022",
                    "2 x double bedroom in Hotel Victoria",
                    "bed and breakfast for:",
                    "2 x adults",
                    "2 x children"
                ]
            },
            price: "877.71 €",
            download: "download"
        },
        {
            invoice: {
                ref: "Invoice #3727382",
                infos: [
                    "Invoice for John Doe generated at 23. jun. 2022",
                    "2 x double bedroom in Hotel Victoria",
                    "bed and breakfast for:",
                    "2 x adults",
                    "2 x children"
                ]
            },
            price: "877.71 €",
            download: "download"
        },
        {
            invoice: {
                ref: "Invoice #3727382",
                infos: [
                    "Invoice for John Doe generated at 23. jun. 2022",
                    "2 x double bedroom in Hotel Victoria",
                    "bed and breakfast for:",
                    "2 x adults",
                    "2 x children"
                ]
            },
            price: "877.71",
            download: "download"
        },
        {
            invoice: {
                ref: "Invoice #3727382",
                infos: [
                    "Invoice for John Doe generated at 23. jun. 2022",
                    "2 x double bedroom in Hotel Victoria",
                    "bed and breakfast for:",
                    "2 x adults",
                    "2 x children"
                ]
            },
            price: "877.71 €",
            download: "download"
        },
        ]


    const columns = [
        {
            title: "",
            field: "",
            render: () => (
                <InvoiceImageContainer>
                    <InvoiceImage src={InvoiceIcon} alt="invoice-icon" height={80} width={80} />
                </InvoiceImageContainer>
            )
        },
        {
            title: "Invoice details",
            field: "invoice",
            render: (rowData: any) =>
                rowData && (
                    <>
                        <InvoiceRef>
                            {rowData.invoice.ref}
                        </InvoiceRef>
                        {
                            rowData.invoice.infos.map((item: any, index: number) =>
                                <InfoItem key={index}>
                                    {item}
                                </InfoItem>
                            )
                        }
                    </>
                )
        },
        {
            title: "Price",
            field: "price",
            render: (rowData: any) =>
                rowData && (
                    <PriceText>
                        {rowData.price}
                    </PriceText>
                )
        },
        {
            title: "Download Invoice",
            field: "download",
            render: (rowData: any) =>
                rowData && (
                    <DownloadButton>
                        Download
                    </DownloadButton>
                )
        },
    ]

    const tableOptions = {
        showTitle: false,
        addRowPosition: 'first',
    }


    return(
        <Layout websiteName={websiteName} colorScheme={colorScheme} breadcrumb={breadcrumbs} isLogin>
            <InvoicePageWrapper>
                <TableContainer>
                    <MaterialTable
                        title=""
                        options={tableOptions}
                        style={{background: "transparent", boxShadow: "none", border: "none"}}
                        columns={columns}
                        data={dummy}
                        icons={tableIcons}
                    />
                </TableContainer>

                <InvoiceBgContainer>
                    <InvoiceBg src={InvoiceBackground} alt="invoice-background" width={533} height={426} />
                </InvoiceBgContainer>
            </InvoicePageWrapper>
        </Layout>
    )
}

export default InvoicePage;