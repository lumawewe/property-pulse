import React, { useEffect, useMemo } from 'react';
import { t } from '../../../../js/common/translations';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Link,
  List,
  ListItem,
  SvgIcon,
  Tooltip,
  Typography
} from '../../elements';
import { NumberOfNightsTag, NightsTagText } from '../../../pages/Checkout.styles';
import formatCurrency from '../../../../js/common/formatCurrency';

const BreakdownItemDiscountCodeApplied = ({ detail, label }) => {
  return (
    <ListItem sx={{ justifyContent: 'space-between', px: 0, py: 0.25 }}>
      <Box display="flex">
        <Typography color="success.main" fontWeight="bold">
          {`${t(`checkout_page.breakdown.${label}`)} ${detail.couponKind === 'percentage' ? (detail.couponValue + '%') : ''}`}
        </Typography>
      </Box>
      <Typography color="success.main" fontWeight="bold" whiteSpace="nowrap">
        {`${detail.couponFinalPrice}`}
      </Typography>
    </ListItem>
  );
};

const BreakdownItem = ({ detail, label, title = '', willMoveWithPet = false }) => {
  const color = label === 'pet_fee' && willMoveWithPet ? 'primary' : label !== 'pet_fee' && !willMoveWithPet ? 'primary' : 'primary.30';
  return (
    <ListItem sx={{ justifyContent: 'space-between', px: 0, py: 0.25 }}>
      <Box display="flex">
        <Typography color={color} alignSelf="center">
          {title || t(`checkout_page.breakdown.${label}_label`)}
        </Typography>
        {detail.hint && (
          <Tooltip title={detail.hint} placement="top">
            <IconButton>
              <SvgIcon name="question_circle" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Typography color={color}>{detail.price}</Typography>
    </ListItem>
  );
};

const BreakdownItemRent = ({ detail, label, nights, fullPaymentType }) => {
  const displayLabel = useMemo(() =>
    label === 'rent_total' ? t(`checkout_page.breakdown.${label}_label`, { days: nights }) : t(`checkout_page.breakdown.${label}_label`),
  [label]);

  if ((!fullPaymentType && label === 'rent_total') || (fullPaymentType && label !== 'rent_total')) return null;

  return (
    <BreakdownItem detail={detail} label={label} title={displayLabel} />
  );
};

const BreakdownItemMonthlyCleaningFeeTotal = ({ detail, label, fullPaymentType }) => {
  if ((!fullPaymentType && label !== 'cleaning_fee') || (fullPaymentType && label === 'cleaning_fee') || (detail.price === 'R$ 0')) return null;
  return (
    <BreakdownItem detail={detail} label={'cleaning_fee'} />
  );
};

const BreakdownDetails = ({
  checkInDate,
  checkOutDate,
  detailsBreakdown,
  numberOfNights,
  handleOpenRentScheduleDrawer,
  fullPaymentType,
  isPetFriendly,
  loadScheduledPayments,
  setDetailsBreakdownState,
  setRentScheduleState,
  willMoveWithPet,
  setWillMoveWithPet,
  couponValidValue
}) => {
  const finalPrice = fullPaymentType ? detailsBreakdown.total_breakdown : detailsBreakdown.due_today;

  useEffect(async() => {
    if (willMoveWithPet) {
      const { data } = await loadScheduledPayments(couponValidValue, willMoveWithPet);
      setRentScheduleState(data);
      setDetailsBreakdownState((prev) => ({
        ...prev,
        total_breakdown: { display: false, title: t('checkout_page.breakdown.due_short_period_label'), price: `R$ ${formatCurrency(data.breakdown.total_w_discount)}` },
        due_today: { display: false, title: t('checkout_page.breakdown.due_today_label'), price: `R$ ${formatCurrency(data.breakdown.payments[0].total)}` }
      }));
    }
  }, []);

  const handleChangeWillMoveWithPet = async(e) => {
    const guestMoveWithPet = e.target.checked;
    setWillMoveWithPet(guestMoveWithPet);
    if (guestMoveWithPet) {
      const { data } = await loadScheduledPayments(couponValidValue, guestMoveWithPet);
      setRentScheduleState(data);
      setDetailsBreakdownState((prev) => ({
        ...prev,
        total_breakdown: { display: false, title: t('checkout_page.breakdown.due_short_period_label'), price: `R$ ${formatCurrency(data.breakdown.total_w_discount)}` },
        due_today: { display: false, title: t('checkout_page.breakdown.due_today_label'), price: `R$ ${formatCurrency(data.breakdown.payments[0].total)}` }
      }));
    } else {
      const { data } = await loadScheduledPayments(couponValidValue, guestMoveWithPet);
      setRentScheduleState(data);
      setDetailsBreakdownState((prev) => ({
        ...prev,
        total_breakdown: { display: false, title: t('checkout_page.breakdown.due_short_period_label'), price: `R$ ${formatCurrency(data.breakdown.total_w_discount)}` },
        due_today: { display: false, title: t('checkout_page.breakdown.due_today_label'), price: `R$ ${formatCurrency(data.breakdown.payments[0].total)}` }
      }));
    }
  };

  return (
    <Box>
      <Box mx="auto" mb={1}>
        <Box
          justifyContent="center"
          bgcolor="primary.100.10"
          display="flex"
          borderRadius="0.25rem"
          py={1}
        >
          <SvgIcon
            name="checkout_calendar_icon"
            size="20"
            mr={0.5}
          />
          <Typography
            variant="lead"
            color="primary.100"
            fontSize="1rem"
          >
            {checkInDate}
          </Typography>
          <SvgIcon
            name="checkout_arrow_right"
            size="20"
            mx={0.4}
          />
          <Typography
            color="primary.100"
            variant="lead"
            fontSize="1rem"
          >
            {checkOutDate}
          </Typography>
        </Box>
        <List>
          <ListItem sx={{ justifyContent: 'space-between', px: 0 }}>
            <Typography color="primary" variant="h6">{t('checkout_page.breakdown.booking_summary')}</Typography>
            <NumberOfNightsTag>
              <NightsTagText>{`${numberOfNights} ${t('checkout_page.nights')}`}</NightsTagText>
            </NumberOfNightsTag>
          </ListItem>
          <Box>
            <Divider sx={{ opacity: '0.07' }} />
            {Object.entries(detailsBreakdown).map(([label, detail], i) => {
              if (!detail.display || label === 'due_today') return null;

              if (label === 'first_month_rent' || label === 'rent_total') {
                return <BreakdownItemRent key={i} detail={detail} label={label} nights={numberOfNights} fullPaymentType={fullPaymentType} />;
              }

              if (detail.display && label === 'discount_code_applied') {
                return <BreakdownItemDiscountCodeApplied key={i} detail={detail} label={label} />;
              }

              if (label === 'cleaning_fee' || label === 'total_monthly_cleaning_fee') {
                return <BreakdownItemMonthlyCleaningFeeTotal key={i} detail={detail} label={label} nights={numberOfNights} fullPaymentType={fullPaymentType} />;
              }

              return <BreakdownItem key={i} detail={detail} label={label} />;
            })}
            {isPetFriendly && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={willMoveWithPet}
                        size='small'
                        onChange={handleChangeWillMoveWithPet}
                      />
                    }
                    label={(
                      <Typography
                        alignSelf="center"
                        fontSize="0.75rem"
                        color={willMoveWithPet ? 'primary.main' : 'primary.30'}>
                        {t('apartment_page.reservation_form.breakdown.will_moving_with_pet')}
                      </Typography>
                    )}
                  />
                </Box>
                <BreakdownItem detail={{ ...detailsBreakdown.pet_fee }} label='pet_fee' willMoveWithPet={willMoveWithPet} />

              </>
            )}
            <Divider sx={{ opacity: '0.07' }} />
            <ListItem sx={{ justifyContent: 'space-between', px: 0 }} >
              <Typography color="primary" variant="h6">{finalPrice.title}</Typography>
              <Typography id="first_month_due_total_w_coupon" color="primary" variant="h6">
                {finalPrice.price}
              </Typography>
            </ListItem>
          </Box>
        </List>
        <Box sx={{ display: fullPaymentType ? 'none' : 'flex' }} flexDirection="column">
          <Typography color="primary.70" variant="lead" my={0.5}>
            {t('checkout_page.scheduled_payments.desc')}
          </Typography>
          <Link onClick={handleOpenRentScheduleDrawer}>
            <Typography variant="lead" fontWeight="600">
              {t('checkout_page.scheduled_payments.button')}
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default BreakdownDetails;
