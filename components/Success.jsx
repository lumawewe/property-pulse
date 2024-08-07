import React from 'react';
import { Box } from '../../../elements';
import { TopStepper } from '../ReservationFormComponents';

const Success = ({ successComponent }) => {
  return (
    <>
      <Box width="100%" display="flex" justifyContent="center" pt={{ xs: 1, md: 5 }} pb={0}>
        <TopStepper success={true} />
      </Box>
      {successComponent}
    </>
  );
};

export default Success;
