import React from 'react';
import { Skeleton, Grid } from '@mui/material';

 

const DynamicSkeleton  = ({
  count = 5,
  variant = 'rect',
  height = 200,
  animation = 'pulse',
  spacing = 2,
  columns = { xs: 12, sm: 6, md: 4, lg: 3 },
  sx = {},
  ...restProps
}) => {
  return (
    <Grid container spacing={spacing} sx={{display:"flex",justifyContent:"center", }}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid
          item
          key={index}
          xs={columns.xs}
          sm={columns.sm}
          md={columns.md}
          lg={columns.lg}
          xl={columns.xl}
        >
          <Skeleton
            variant={variant}
            height={height}
            animation={animation}
            sx={{ width: '100%', bgcolor: 'green.800', ...sx }}  
            {...restProps}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default DynamicSkeleton;