import { FC } from "react"

import { IconButton, Box, Typography } from "@mui/material"
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"

interface Props {
    currentValue: number;
    updateQuantity: (value: number) => void;
    maxValue: number;
}

export const ItemCounter: FC<Props> = ({ currentValue, updateQuantity, maxValue }) => {
    const handlerCounter = (value: number) => {
        if (value === -1) {
            if (currentValue === 1) return

            return updateQuantity(currentValue - 1)
        }

        if (currentValue >= maxValue) return;
        updateQuantity(currentValue + 1)

    }

    return (
        <Box display='flex' alignItems='center'>
            <IconButton disabled={currentValue === 0} onClick={() => handlerCounter(-1)}>
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>
            <IconButton disabled={currentValue === maxValue} onClick={() => handlerCounter(+1)}>
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}
