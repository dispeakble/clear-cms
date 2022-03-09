import React from 'react';
import {Skeleton} from '@material-ui/lab'
import {Item} from '../Item'


export default function() {
    return (
           <Item>
               <Skeleton variant="text" width={140} height={30} style={{marginBottom: 20}} />
               <Skeleton variant="text" width={210} height={118} />
           </Item>
    )
}