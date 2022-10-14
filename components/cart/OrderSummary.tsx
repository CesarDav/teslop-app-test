import { useContext } from "react"

import { Grid, Typography } from "@mui/material"

import { CartContext } from "context"
import { currency } from "utils";


interface Props {
    totalProp?: number,
    numberOfItemsProp?: number,
    subTotalProp?: number,
    taxProp?: number
}

export const OrderSummary = ({ totalProp, numberOfItemsProp, subTotalProp, taxProp }: Props) => {

    const { numberOfItems, total, subTotal, tax } = useContext(CartContext);

    const numberOfItemsShow = numberOfItemsProp ? numberOfItemsProp : numberOfItems;

    const totalShow = totalProp ? totalProp : total;

    const subTotalShow = subTotalProp ? subTotalProp : subTotal;

    const taxShow = taxProp ? taxProp : tax;

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>N. Products</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent="end">
                <Typography>{numberOfItemsShow} {numberOfItemsShow > 1 ? 'products' : 'product'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>SubTotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent="end">
                <Typography>{currency.format(subTotalShow)}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Taxes ({process.env.NEXT_PUBLIC_TAX_RATE}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent="end">
                <Typography>{currency.format(taxShow)}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Total:</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent="end" sx={{ mt: 2 }}>
                <Typography variant="subtitle1">{currency.format(totalShow)}</Typography>
            </Grid>
        </Grid>
    )
}
