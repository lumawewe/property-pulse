import React from 'react';
import { t } from '../../../../js/common/translations';
import {
  Box,
  Divider,
  ListItem,
  Typography
} from '../../elements';

import { format } from '../../../../js/common/dates';
import formatCurrency from '../../../../js/common/formatCurrency';

import { RentDetailsWrapper } from './RentScheduleDetails.styles';

const RentScheduleDetails = ({ rentScheduleState }) => {
  const { payments } = rentScheduleState.breakdown;

  return (
    <Box mx={1}>
      <Box mb={1}>
        <Typography color="primary">
          {t('scheduled_payments.js.modal.description')}
        </Typography>
      </Box>
      <Box>
        {payments.map((p, i) => {
          return (
            <Box key={i}>
              <ListItem sx={{ justifyContent: 'space-between', px: 0 }}>
                <Typography
                  color="primary"
                  textTransform="capitalize"
                  alignSelf="center"
                  variant="h6"
                >
                  {paymentSchedulePrintDay(p.date, i)}
                </Typography>
                <Typography color="primary" variant="h6">{`R$ ${formatCurrency(p.total)}`}</Typography>
              </ListItem>
              <Divider sx={{ opacity: '0.07' }} />
              {scheduledPaymentsBreakDown(p, i) && (
                <Box pt={1}>
                  {p.prorated ? (
                    <Typography color="primary" align="center">{t('scheduled_payments.js.modal.prorated')}</Typography>
                  ) : p.breakdown.rent && (
                    <RentDetailsWrapper>
                      <Typography color="primary">{printScheduleLabel(i)}</Typography>
                      <Typography color="primary">{`R$ ${formatCurrency(p.breakdown.rent)}`}</Typography>
                    </RentDetailsWrapper>
                  ) }
                  {p.breakdown.coupon_discount && (
                    <RentDetailsWrapper>
                      <Typography color="success.main">
                        {t('scheduled_payments.js.modal.discount_coupon')}
                      </Typography>
                      <Typography color="success.main">
                        {`R$ ${formatCurrency(p.breakdown.coupon_discount)}`}
                      </Typography>
                    </RentDetailsWrapper>
                  )}
                  {p.breakdown.long_term_discount < 0 && (
                    <RentDetailsWrapper>
                      <Typography color="primary">{t('scheduled_payments.js.modal.long_term_discount')}</Typography>
                      <Typography color="primary">{`R$ ${formatCurrency(-1 * p.breakdown.long_term_discount)}`}</Typography>
                    </RentDetailsWrapper>
                  )}
                  {(!!p.breakdown.cleaning_fee && !p.prorated) && (
                    <RentDetailsWrapper>
                      <Typography color="primary">{t('scheduled_payments.js.modal.cleaning_fee')}</Typography>
                      <Typography color="primary" >{`R$ ${formatCurrency(p.breakdown.cleaning_fee)}`}</Typography>
                    </RentDetailsWrapper>
                  )}
                  {p.breakdown.deposit_amount && (
                    <RentDetailsWrapper>
                      <Typography color="primary">{t('scheduled_payments.js.modal.deposit_amount')}</Typography>
                      <Typography color="primary">{`R$ ${formatCurrency(p.breakdown.deposit_amount)}`}</Typography>
                    </RentDetailsWrapper>
                  )}
                  {p.breakdown.final_cleaning_fee && (
                    <RentDetailsWrapper>
                      <Typography color="primary">{t('scheduled_payments.js.modal.final_cleaning_fee')}</Typography>
                      <Typography color="primary">{`R$ ${formatCurrency(p.breakdown.final_cleaning_fee)}`}</Typography>
                    </RentDetailsWrapper>
                  )}
                  {p.breakdown.fire_insurance && (
                    <RentDetailsWrapper>
                      <Typography color="primary">{t('scheduled_payments.js.modal.fire_insurance')}</Typography>
                      <Typography color="primary">{`R$ ${formatCurrency(p.breakdown.fire_insurance)}`}</Typography>
                    </RentDetailsWrapper>
                  )}
                  {(p.breakdown.pet_fee) && (
                    <RentDetailsWrapper>
                      <Typography color="primary">{t('scheduled_payments.js.modal.pet_fee')}</Typography>
                      <Typography color="primary" >{`R$ ${formatCurrency(p.breakdown.pet_fee)}`}</Typography>
                    </RentDetailsWrapper>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const scheduledPaymentsBreakDown = ({ breakdown, prorated }, index) => {
  return index === 0 ||
        (!!breakdown.deposit_amount) ||
        (!!breakdown.cleaning_fee) ||
        prorated !== undefined;
};

const paymentSchedulePrintDay = (date, index) => {
  if (index === 0) {
    return t('scheduled_payments.js.modal.today');
  }
  return format(date, 'MMMM DD, YYYY');
};

const printScheduleLabel = (index) => {
  if (index === 0) {
    return t('scheduled_payments.js.modal.first_month_rent');
  }

  return t('scheduled_payments.js.modal.month_rent');
};

export default RentScheduleDetails;
