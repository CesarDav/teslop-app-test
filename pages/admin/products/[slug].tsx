import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react'

import { GetServerSideProps } from 'next';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField, useStepContext } from '@mui/material';
import { useForm } from 'react-hook-form';


import { AdminLayout } from 'components/layouts';
import { dbProducts } from 'database';
import { IProduct, ISize, IType } from 'interfaces';
import { tesloApi } from 'api';
import { Product } from 'models';
import { useRouter } from 'next/router';


const validTypes: IType[] = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes: ISize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

interface FormData {
    _id?: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: ISize[];
    slug: string;
    tags: string[];
    title: string;
    type: IType;
    gender: 'men' | 'women' | 'kid' | 'unisex';
}

interface Props {
    product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {

    const router = useRouter();
    const [newTagValue, setNewTagValue] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm({
        defaultValues: product
    });

    // probar rege recomendado
    // const regex = /[^a-zA-Z0-9_]/gi
    // const newSlug = value.title?.trim().replaceAll(' ', '_').replaceAll(regex, '').toLocaleLowerCase() || ''

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name == 'title') {
                const newSlug = value.title?.trim()
                    .replaceAll(' ', '_')
                    .replaceAll("'", '')
                    .toLocaleLowerCase() || '';
                setValue('slug', newSlug);
            }
        });

        return () => subscription.unsubscribe();
    }, [])



    const onNewTab = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();
        setNewTagValue('');
        const currentTags = getValues('tags');
        if (currentTags.includes(newTag)) return;

        currentTags.push(newTag)
    }

    const onDeleteTag = (tag: string) => {
        const updatedTags = getValues('tags').filter((t) => t !== tag);

        setValue('tags', updatedTags, { shouldValidate: true });

    }

    const onFilesSelectd = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (!target.files) return;
        if (target.files.length === 0) return
        try {
            for (const file of target.files) {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData);
                setValue('images', [...getValues('images'), data.message], { shouldValidate: true })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onDeleteImage = (image: string) => {
        setValue('images', getValues('images').filter(img => img !== image), { shouldValidate: true });

    }


    const onSubmit = async (data: FormData) => {
        if (data.images.length < 2) return alert('At least two images are required');

        setIsSaving(true);
        // console.log(data)
        try {
            const resp = await tesloApi({
                url: '/admin/products',
                method: data._id ? 'PUT' : 'POST',// si tenemos un _id, entonces actualizar, si no crear
                data: data
            });
            if (!data._id) {
                router.replace(`/admin/products/${data.slug}`)
            } else {
                setIsSaving(false);
            }

        } catch (error) {
            console.log(error);
            setIsSaving(false);
        }


    }

    const onChangeSize = (size: ISize) => {
        const currentSizes = getValues('sizes');
        if (currentSizes.includes(size)) {
            setValue('sizes', currentSizes.filter(s => s !== size), { shouldValidate: true });
            return
        }
        setValue('sizes', [...currentSizes, size], { shouldValidate: true });
    };

    return (
        <AdminLayout
            title={'Producto'}
            subTitle={`Editando: ${product.title}`}
            icon={<DriveFileRenameOutline />}
        >
            <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                        <Button
                            color="secondary"
                            startIcon={<SaveOutlined />}
                            sx={{ width: '150px' }}
                            type="submit"
                            disabled={isSaving}
                        >
                            Guardar
                        </Button>
                    </Box>

                    <Grid container spacing={2}>
                        {/* Data */}
                        <Grid item xs={12} sm={6}>

                            <TextField
                                label="Título"
                                variant="filled"
                                fullWidth
                                sx={{ mb: 1 }}
                                {...register('title', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.title}
                                helperText={errors.title?.message}
                            />

                            <TextField
                                label="Descripción"
                                variant="filled"
                                fullWidth
                                multiline
                                rows={5}
                                sx={{ mb: 1 }}
                                {...register('description', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />

                            <TextField
                                label="Inventario"
                                type='number'
                                variant="filled"
                                fullWidth
                                sx={{ mb: 1 }}
                                {...register('inStock', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 0, message: 'Mínimo 2 Minimum of zero value ' }
                                })}
                                error={!!errors.inStock}
                                helperText={errors.inStock?.message}
                            />
                            <TextField
                                label="Precio"
                                type='number'
                                variant="filled"
                                fullWidth
                                sx={{ mb: 1 }}
                                {...register('price', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 0, message: 'Mínimo 2 Minimum of zero value ' }
                                })}
                                error={!!errors.price}
                                helperText={errors.price?.message}

                            />
                            <Divider sx={{ my: 1 }} />
                            <FormControl sx={{ mb: 1 }}>
                                <FormLabel>Tipo</FormLabel>
                                <RadioGroup
                                    row
                                    value={getValues('type')}
                                    onChange={({ target }) => setValue('type', target.value as IType, { shouldValidate: true })}
                                >
                                    {
                                        validTypes.map(option => (
                                            <FormControlLabel
                                                key={option}
                                                value={option}
                                                control={<Radio color='secondary' />}
                                                label={capitalize(option)}
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                            <FormControl sx={{ mb: 1 }}>
                                <FormLabel>Género</FormLabel>
                                <RadioGroup
                                    row
                                    value={getValues('gender')}
                                    onChange={({ target }) => setValue('gender', target.value as 'men' | 'women' | 'kid' | 'unisex', { shouldValidate: true })}
                                >
                                    {
                                        validGender.map(option => (
                                            <FormControlLabel
                                                key={option}
                                                value={option}
                                                control={<Radio color='secondary' />}
                                                label={capitalize(option)}
                                            />
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>

                            <FormGroup>
                                <FormLabel>Sizes</FormLabel>
                                {
                                    validSizes.map((size) => (
                                        <FormControlLabel
                                            key={size}
                                            control={<Checkbox checked={getValues('sizes').includes(size)} />}
                                            label={size}
                                            onChange={() => onChangeSize(size)}

                                        />
                                    ))
                                }
                            </FormGroup>

                        </Grid>

                        {/* Tags e imagenes */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Slug - URL"
                                variant="filled"
                                fullWidth
                                sx={{ mb: 1 }}
                                {...register('slug', {
                                    required: 'Este campo es requerido',
                                    validate: (val) => val.trim().includes(' ') ? 'You cannot have blank spaces' : undefined,
                                    minLength: { value: 0, message: 'Mínimo 2 Minimum of zero value ' }
                                })}
                                error={!!errors.slug}
                                helperText={errors.slug?.message}
                            />
                            <TextField
                                label="Etiquetas"
                                variant="filled"
                                fullWidth
                                sx={{ mb: 1 }}
                                helperText="Presiona [spacebar] para agregar"
                                onKeyUp={({ code }) => code === 'Space' ? onNewTab() : undefined}
                                value={newTagValue}
                                onChange={({ target }) => setNewTagValue(target.value)}

                            />
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                listStyle: 'none',
                                p: 0,
                                m: 0,
                            }}
                                component="ul">
                                {
                                    getValues('tags').map((tag) => {
                                        return (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                onDelete={() => onDeleteTag(tag)}
                                                color="primary"
                                                size='small'
                                                sx={{ ml: 1, mt: 1 }}
                                            />
                                        );
                                    })}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box display='flex' flexDirection="column">
                                <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
                                <Button
                                    color="secondary"
                                    type='submit'
                                    fullWidth
                                    startIcon={<UploadOutlined />}
                                    sx={{ mb: 3 }}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Cargar imagen
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type='file'
                                    multiple
                                    accept='image/png,image/gif,image/jpeg'
                                    style={{ display: 'none' }}
                                    onChange={onFilesSelectd}
                                />

                                <Chip
                                    label="Es necesario al 2 imagenes"
                                    color='error'
                                    variant='outlined'
                                    sx={{ display: getValues('images').length < 2 ? 'flex' : 'none' }}
                                />

                                <Grid container spacing={2}>
                                    {
                                        getValues('images').map(img => (
                                            <Grid item xs={4} sm={3} key={img}>
                                                <Card>
                                                    <CardMedia
                                                        component='img'
                                                        className='fadeIn'
                                                        image={img}
                                                        alt={img}
                                                    />
                                                    <CardActions>
                                                        <Button
                                                            onClick={() => onDeleteImage(img)}
                                                            fullWidth
                                                            color="error">
                                                            Borrar
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </Grid>
                                        ))
                                    }
                                </Grid>

                            </Box>

                        </Grid>

                    </Grid>
                </form>
            </>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { slug = '' } = query;

    let product: IProduct | null;

    if (slug === 'new') {
        const tempProduct = JSON.parse(JSON.stringify(new Product()));
        delete tempProduct._id;
        tempProduct.images = ['imag1.png', 'imag2.png'];
        product = tempProduct

    } else {

        product = await dbProducts.getProductBySlug(slug.toString());

    }


    if (!product) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }


    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage