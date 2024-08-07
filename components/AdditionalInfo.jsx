/* eslint-disable camelcase */
import React, { useEffect, useRef, useState } from 'react';
import { t } from '../../../../../js/common/translations';
import { ThemeProvider } from '../../../../contexts/theme';
import {
  Box,
  TextField,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  Button,
  Select,
  Typography,
  SvgIcon,
  MenuItem
} from '../../../elements';
import {
  BottomButtonsWrapper, Container, FormTitle, OptionButtons
} from '../ReservationForm.styles';
import { useBreakpoint } from '../../../../hooks/useBreakpoint';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {
  FinishLaterModal,
  MobileStepper,
  TopStepper,
  DesktopStepper
} from '../ReservationFormComponents';
import inputValidator from '../../../../utils/inputValidator';

const INITIAL_CAR_OBJ = { model: '', color: '', license_plate: '' };

const CarInfo = ({
  index,
  handleCarChange,
  car = INITIAL_CAR_OBJ,
  removeCar,
  isSubmitted
}) => {
  const [carObj, setCarObj] = useState({
    model: car.model,
    color: car.color,
    license_plate: car.license_plate
  });

  const handleChange = (inputName) => ({ target: { value } }) => {
    setCarObj(state => ({
      ...state,
      [inputName]: value
    }));
  };

  return (
    <>
      <Typography pt={1.5} pb={1}>{`${t('reservation_form.additional_info.vehicle')} - ${index + 1}`}</Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
        <TextField
          label={t('reservation_form.additional_info.cars.model')}
          value={carObj.model}
          disabled={isSubmitted}
          onChange={handleChange('model')}
          onBlur={handleCarChange(index, 'model')}
          margin="dense"
          sx={{
            mr: { xs: 0, md: 1 },
            mt: { xs: 1, md: 0 }
          }}
        />
        <TextField
          label={t('reservation_form.additional_info.cars.color')}
          margin="dense"
          value={carObj.color}
          disabled={isSubmitted}
          onChange={handleChange('color')}
          onBlur={handleCarChange(index, 'color')}
          sx={{
            mr: { xs: 0, md: 1 },
            mt: { xs: 1, md: 0 }
          }}
        />
        <TextField
          label={t('reservation_form.additional_info.cars.plate')}
          margin="dense"
          value={carObj.license_plate}
          disabled={isSubmitted}
          onChange={handleChange('license_plate')}
          onBlur={handleCarChange(index, 'license_plate')}
          sx={{
            mr: { xs: 0, md: 0.5 },
            mt: { xs: 1, md: 0 }
          }}
        />
        {index > 0 ? <OptionButtons onClick={() => {
          removeCar(index);
        }}>
          <SvgIcon name="trash_red_square" width="90px" height="54px" />
        </OptionButtons> : <OptionButtons />
        }
      </Box >
    </>
  );
};

const INITIAL_ADDITIONAL_OBJ = {
  is_moving_with_pet: false,
  is_using_parking_spot: false,
  planned_check_in_time: 'empty',
  guests_count: 0
};

const AdditionalInfo = ({
  reservationInfo = INITIAL_ADDITIONAL_OBJ,
  previousStepUrl,
  nextStepUrl,
  reservationFormSubmitPath,
  maxCheckInTime,
  maxGuests,
  availableCheckInHours,
  formStatus,
  isPetFriendly,
  hasParkingSlot,
  parkingSlotCount,
  reservationSource
}) => {
  const mobile = ['xs', 'sm'].includes(useBreakpoint());
  const [openFinishLater, setOpenFinishLater] = useState(false);
  const isSubmitted = formStatus === 'Submitted' || formStatus === 'Approved';
  const scrollBottom = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errorsText, setErrorsText] = useState([]);
  const [carFieldCounter, setCarFieldCounter] = useState(1);
  const [personalInfo, setPersonalInfo] = useState({
    is_moving_with_pet: reservationInfo?.is_moving_with_pet || false,
    is_using_parking_spot: reservationInfo?.is_using_parking_spot || false,
    planned_check_in_time: reservationInfo?.planned_check_in_time || 'empty',
    guests_count: reservationInfo?.guests_count || 0
  });

  const baseUrl = nextStepUrl.split('?')[0];

  const [cars, setCars] = useState(() => {
    if (reservationInfo.cars.map((car) => car).length === 0) {
      return [{ car: {} }];
    } else {
      return reservationInfo.cars.map((car) => car);
    }
  });
  const [fieldCar, setFieldCar] = useState([]);

  useEffect(() => {
    const url = nextStepUrl.split('?')[0] + '?step=6';
    if (isSubmitted) {
      window.location.href = url;
    }
  }, [formStatus]);

  const removeCar = async(arrKey) => {
    if (!cars[arrKey]?.car_id) {
      setFieldCar((item) => item.filter((_, index) => index !== arrKey));
      setCars((item) => item.filter((_, index) => index !== arrKey));
      setCarFieldCounter(carFieldCounter - 1);
      return;
    }

    const reservationFormCarPath = `${window.location.origin}/reservation_form/${reservationInfo.id}/reservation_form_cars/${cars[arrKey].car_id}`;

    try {
      await axios.delete(reservationFormCarPath);
      setFieldCar((item) => item.filter((_, index) => index !== arrKey));
      setCars((item) => item.filter((_, index) => index !== arrKey));
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (inputName) => ({ target: { value } }) => {
    setPersonalInfo(state => ({
      ...state,
      [inputName]: value
    }));
  };

  const handleCarChange = (index, inputName) => ({ target: { value } }) => {
    const carsCopy = [...cars];

    if (carsCopy[index]) {
      carsCopy[index].car[inputName] = value;
    } else {
      carsCopy[index] = {
        car: {
          [inputName]: value
        }
      };
    }

    setCars(carsCopy);
  };

  const handleAddFieldCar = () => {
    if (carFieldCounter < parkingSlotCount) {
      const carsCopy = [...cars];
      carsCopy.push({ car: {} });
      setCars(carsCopy);
      setCarFieldCounter(carFieldCounter + 1);
    }
  };

  const reservationFormData = (information, step, status = 1) => {
    const formData = new FormData();

    Object.entries(information).forEach((value) => {
      formData.append(`reservation_form[${value[0]}]`, value[1]);
    });

    formData.append('reservation_form[status]', status);
    formData.append('reservation_form[form_step]', step);

    return formData;
  };

  const carsData = (cars) => {
    const formData = new FormData();

    cars.forEach((carObj) => {
      Object.entries(carObj.car).forEach((value) => {
        formData.append(`reservation_form_cars[cars][][${value[0]}]`, value[1]);
      });
    });

    return formData;
  };

  const formValidations = [
    ['guests_count', { validation: () => !(personalInfo.guests_count === 0), errorMessage: t('form_errors.empty_field') }],
    ['is_moving_with_pet', { validation: () => !(personalInfo.is_moving_with_pet === null), errorMessage: t('form_errors.empty_field') }],
    ['is_using_parking_spot', { validation: () => !(personalInfo.is_using_parking_spot === null), errorMessage: t('form_errors.empty_field') }],
    ['planned_check_in_time', { validation: () => !(personalInfo.planned_check_in_time === 'empty'), errorMessage: t('form_errors.empty_field') }]
  ];

  const getErrorMessage = (inputName) => {
    return errorsText.filter(el => el.field === inputName)[0]?.error;
  };

  const handleSubmitForm = async(url, step = 5, finishLater = false, status = 1) => {
    const reservationForm = reservationFormData(personalInfo, step, status);
    const reservationFormCars = carsData(cars);
    setLoading(true);
    const errors = inputValidator(personalInfo, formValidations);
    const reservationFormCarsPath = `${window.location.origin}/reservation_form/${reservationInfo.id}/reservation_form_cars`;
    if (errors.length && !finishLater) {
      setLoading(false);
      setErrorsText(errors);
    } else {
      try {
        await axios.patch(reservationFormSubmitPath, reservationForm);
        if (personalInfo.is_using_parking_spot === true || personalInfo.is_using_parking_spot === 'true') {
          await axios.patch(reservationFormCarsPath, reservationFormCars);
        }
        window.location.href = url;
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (personalInfo.is_using_parking_spot) {
    setTimeout(() => {
      scrollBottom.current.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }, 220);
  }

  useEffect(() => {
    const carComponentArray = [];

    if (cars.length === 0) {
      carComponentArray.push(<CarInfo
        sx={{ mt: 0.5 }}
        key={uuidv4()}
        index={0}
        isSubmitted={isSubmitted}
        handleCarChange={handleCarChange}
        cars={cars[0]?.car || {}}
        removeCar={removeCar}
      />);
      setCarFieldCounter(0);
    }

    cars.forEach((carObj, index) => {
      carComponentArray.push(<CarInfo
        sx={{ mt: 0.5 }}
        key={uuidv4()}
        isSubmitted={isSubmitted}
        index={index}
        handleCarChange={handleCarChange}
        car={carObj?.car || {}}
        removeCar={removeCar}
      />);
    });

    setFieldCar(carComponentArray);
  }, [cars.length]);

  return (
    <ThemeProvider>
      <Container>
        <Box
          px={{ xs: 1, md: 2 }}
          pb={6}
          pt={1}
          height={{ xs: 'auto', md: '100vh' }}
          sx={{ overflowY: 'auto' }}
        >
          <Box width="100%" display="flex" justifyContent="center" pt={{ xs: 1, md: 5 }} pb={{ xs: 2, md: 5 }}>
            <TopStepper />
          </Box>
          <Box>
            {mobile ? (
              <MobileStepper
                porcentageValue={60}
                actualStep={4}
                title={t('reservation_form.additional_info.title')}
              />
            ) : (
              <DesktopStepper activeStep={3} path={nextStepUrl} />
            )}
          </Box>
          <Box mt={{ xs: 2, md: 4 }}>
            <FormTitle mb={0.5}>
              {t('reservation_form.additional_info.planned_check_in_time')}
            </FormTitle>
            <Select
              onChange={handleChange('planned_check_in_time')}
              defaultValue='empty'
              value={personalInfo.planned_check_in_time || 'empty'}
              sx={{
                '& legend': { display: 'none' },
                '& fieldset': { top: 0 }
              }}
            >
              <MenuItem value='empty'>--:--</MenuItem>
              {availableCheckInHours.map((item, i) => (
                <MenuItem key={i} value={item}>{item}</MenuItem>
              ))}
            </Select>
            {!!getErrorMessage('planned_check_in_time') && (
              <Box display="flex" mt={0.25}>
                <SvgIcon name="error_input_icon" />
                <Typography fontSize={12} ml={0.25} color="error.main">{getErrorMessage('planned_check_in_time')}</Typography>
              </Box>
            )}
            <Typography fontSize={12} mt={0.5} display='flex' alignItems="center">
              <SvgIcon name="info" mr={0.25} />
              {t('reservation_form.additional_info.check_in_info')}
            </Typography>
          </Box>
          <Box mb={0.5}>
            <FormTitle my={0.5}>
              {t('reservation_form.additional_info.how_many_guests')}
            </FormTitle>
            <Select
              onChange={handleChange('guests_count')}
              value={personalInfo.guests_count || 0}
              error={!!getErrorMessage('guests_count')}
              sx={{
                '& legend': { display: 'none' },
                '& fieldset': { top: 0 }
              }}
            >
              <MenuItem value={0}>0</MenuItem>
              {[...new Array(maxGuests).keys()].map((i) => (
                <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
              ))}
            </Select>
            {!!getErrorMessage('guests_count') && (
              <Box display="flex" mt={0.25}>
                <SvgIcon name="error_input_icon" />
                <Typography fontSize={12} ml={0.25} color="error.main">{getErrorMessage('guests_count')}</Typography>
              </Box>
            )}
          </Box>
          {reservationSource !== 'website' && (
            <>
              <FormTitle>
                {t('reservation_form.additional_info.pets')}
              </FormTitle>
              {isPetFriendly ? (
                <Box>
                  <FormControl mb={1}>
                    <RadioGroup row
                      disabled={isSubmitted}
                      value={personalInfo?.is_moving_with_pet || false}
                      onChange={handleChange('is_moving_with_pet')}
                    >
                      <FormControlLabel value={true} control={<Radio />} label={t('reservation_form.yes_radio')} />
                      <FormControlLabel value={false} control={<Radio />} label={t('reservation_form.no_radio')} />
                    </RadioGroup>
                    {!!getErrorMessage('is_moving_with_pet') && (
                      <Box display="flex" mt={0.25}>
                        <SvgIcon name="error_input_icon" />
                        <Typography fontSize={12} ml={0.25} color="error.main">{getErrorMessage('is_moving_with_pet')}</Typography>
                      </Box>
                    )}
                  </FormControl>
                </Box>
              ) : (
                <Box display="flex" mt={0.25} mb={0.5}>
                  <SvgIcon name="error_input_icon" />
                  <Typography fontSize={12} ml={0.25} color="error.main">{t('reservation_form.additional_info.verify_pets')}</Typography>
                </Box>)
              }
            </>
          )}
          <Box>
            {hasParkingSlot && (
              <><FormTitle>
                {t('reservation_form.additional_info.parking')}
              </FormTitle><Box display='flex' flexDirection="column">
                <FormControl width='100%' sx={{ mb: 2 }}>
                  <RadioGroup
                    row
                    value={personalInfo?.is_using_parking_spot || false}
                    disabled={isSubmitted}
                    onChange={handleChange('is_using_parking_spot')}
                  >
                    <FormControlLabel value={true} control={<Radio />} label={t('reservation_form.yes_radio')} />
                    <FormControlLabel value={false} control={<Radio />} label={t('reservation_form.no_radio')} />
                  </RadioGroup>
                  {!!getErrorMessage('is_using_parking_spot') && (
                    <Box display="flex" mt={0.25}>
                      <SvgIcon name="error_input_icon" />
                      <Typography fontSize={12} ml={0.25} color="red">{getErrorMessage('is_using_parking_spot')}</Typography>
                    </Box>
                  )}
                  {(personalInfo.is_using_parking_spot === 'true' || personalInfo.is_using_parking_spot === true) && (
                    <>
                      <Box pt={2}>
                        <Typography variation="h5">{t('reservation_form.additional_info.vehicles')}</Typography>
                        {fieldCar}
                      </Box>
                      <Box width="100%" display="flex" justifyContent="center">
                        {carFieldCounter < parkingSlotCount && (<Button name="car" variant="contained"
                          color="primary"
                          size="large"
                          sx={{ width: 300, mt: 1, mb: 1 }}
                          onClick={handleAddFieldCar}>{t('reservation_form.additional_info.cars.register_another')}</Button>)}
                      </Box>
                    </>
                  )}
                </FormControl>
                <Box ref={scrollBottom} />
              </Box></>
            )}
          </Box>
        </Box>
        <BottomButtonsWrapper justifyContent={{ xs: 'flex-end', md: 'center' }}>
          <Button
            size="large"
            sx={{ position: 'absolute', left: { xs: -16, md: -8 } }}
            variant="outline"
            onClick={() => setOpenFinishLater(true)}
          >
            {t('reservation_form.finish_later')}
          </Button>
          <Button
            href={previousStepUrl}
            size="large"
            sx={{ mr: { xs: 0.5, md: 1 } }}
          >
            {t('reservation_form.back')}
          </Button>
          <Button onClick={() => personalInfo.guests_count === 1 ? handleSubmitForm(`${baseUrl}?step=6`, 4, false, 2) : handleSubmitForm(nextStepUrl)} size="large"
            loading={loading}
            disabled={loading}
          >
            {t('reservation_form.next')}
          </Button>
        </BottomButtonsWrapper>
      </Container>
      <FinishLaterModal
        open={openFinishLater}
        close={setOpenFinishLater}
        submit={handleSubmitForm}
        step={4}
        path={nextStepUrl}
      />
    </ThemeProvider>
  );
};

export default AdditionalInfo;
