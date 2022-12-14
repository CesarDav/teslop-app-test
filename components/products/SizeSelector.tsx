import { FC } from "react"

import { Box, Button } from "@mui/material";
import { ISize } from "interfaces";

interface Props {
    selectedSize?: ISize;
    sizes: ISize[];
    //methods
    onSelectSize: (size: ISize) => void
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectSize }) => {
    return (
        <Box>
            {
                sizes.map(size => (
                    <Button
                        key={size}
                        size='small'
                        color={selectedSize === size ? "primary" : 'info'}
                        onClick={() => onSelectSize(size)}
                    >
                        {size}
                    </Button>
                ))
            }
        </Box>
    )
}
