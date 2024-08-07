/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { t } from '../../../../../js/common/translations';
import { FormTitle, BottomButtonsWrapper, Container } from '../ReservationForm.styles';
import { useBreakpoint } from '../../../../hooks/useBreakpoint';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '../../../elements';
import { ThemeProvider } from '../../../../contexts/theme';
import axios from 'axios';
import inputValidator from '../../../../utils/inputValidator';
import countryList from 'react-select-country-list';
import { DesktopStepper, FinishLaterModal, MobileStepper, TopStepper } from '../ReservationFormComponents';

const INITIAL_ADDRESS_OBJ = {
  zip_code: '',
  address: '',
  city: '',
  state: '',
  country: ''
};

const Address = ({
  reservationInfo = INITIAL_ADDRESS_OBJ,
  previousStepUrl,
  nextStepUrl,
  reservationFormSubmitPath,
  formStatus
}) => {
  const mobile = ['xs', 'sm'].includes(useBreakpoint());
  const [errorsText, setErrorsText] = useState([]);
  const isSubmitted = formStatus === 'Submitted' || formStatus === 'Approved';
  const options = countryList().getData();
  const [loading, setLoading] = useState(false);
  const [openFinishLater, setOpenFinishLater] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    zip_code: reservationInfo.zip_code,
    address: reservationInfo.address,
    city: reservationInfo.city,
    state: reservationInfo.state,
    country: reservationInfo.country
  });

  const formValidations = [
    ['zip_code', { validation: 'required', errorMessage: t('form_errors.empty_field') }],
    ['address', { validation: 'required', errorMessage: t('form_errors.empty_field') }],
    ['city', { validation: 'required', errorMessage: t('form_errors.empty_field') }],
    ['state', { validation: 'required', errorMessage: t('form_errors.empty_field') }],
    ['country', { validation: 'required', errorMessage: t('form_errors.empty_field') }]
  ];

  const handleChange = (inputName) => ({ target: { value } }) => {
    setPersonalInfo(state => ({
      ...state,
      [inputName]: value
    }));
  };

  useEffect(() => {
    const url = nextStepUrl.split('?')[0] + '?step=6';
    if (isSubmitted) {
      window.location.href = url;
    }
  }, [formStatus]);

  const reservationFormData = (information, step) => {
    const formData = new FormData();

    Object.entries(information).forEach((value) => {
      formData.append(`reservation_form[${value[0]}]`, value[1]);
    });

    formData.append('reservation_form[status]', 1);
    formData.append('reservation_form[form_step]', step);

    return formData;
  };

  const handleSubmitForm = async(url, step = 4) => {
    const reservationForm = reservationFormData(personalInfo, step);
    setLoading(true);
    const errors = inputValidator(personalInfo, formValidations);
    if (errors.length) {
      setLoading(false);
      setErrorsText(errors);
    } else {
      try {
        await axios.patch(reservationFormSubmitPath, reservationForm);
        window.location.href = url;
      } catch (e) {
        console.error(e); // toast
      }
    }
  };

  const getErrorMessage = (inputName) => {
    return errorsText.filter(el => el.field === inputName)[0]?.error;
  };

  return (
    <ThemeProvider>
      <Container>
        <Box px={{ xs: 1, md: 2 }} pb={6} pt={1}>
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            pt={{ xs: 1, md: 5 }}
            pb={{ xs: 2, md: 5 }}
          >
            <TopStepper />
          </Box>
          <Box>
            {mobile ? (
              <MobileStepper
                porcentageValue={40}
                actualStep={3}
                title={t('reservation_form.address.title')} />
            ) : (
              <DesktopStepper activeStep={2} path={nextStepUrl} />
            )}
          </Box>
          <Box mt={{ xs: 2, md: 4 }}>
            <FormTitle>
              {t('reservation_form.address.title')}
            </FormTitle>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
              <TextField
                label={t('reservation_form.address.zip_code')}
                margin="dense"
                disabled={isSubmitted}
                error={!!getErrorMessage('zip_code')}
                helperText={getErrorMessage('zip_code')}
                value={personalInfo.zip_code}
                onChange={handleChange('zip_code')}
              />
              <TextField
                label={t('reservation_form.address.home_address')}
                margin="dense"
                disabled={isSubmitted}
                sx={{ width: '100%', ml: { xs: 0, md: 1 } }}
                error={!!getErrorMessage('address')}
                helperText={getErrorMessage('address')}
                value={personalInfo.address}
                onChange={handleChange('address')}
              />
            </Box>
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
              <TextField
                label={t('reservation_form.address.city')}
                margin="dense" sx={{ width: '100%', mr: { xs: 0, md: 1 } }}
                error={!!getErrorMessage('city')}
                disabled={isSubmitted}
                helperText={getErrorMessage('city')}
                value={personalInfo.city}
                onChange={handleChange('city')}
              />
              <TextField
                label={t('reservation_form.address.state')}
                margin="dense" sx={{ width: '100%', mr: { xs: 0, md: 1 } }}
                value={personalInfo.state}
                error={!!getErrorMessage('state')}
                disabled={isSubmitted}
                helperText={getErrorMessage('state')}
                onChange={handleChange('state')}
              />
              <FormControl sx={{ width: '100%', mt: 0.5 }} >
                <InputLabel id="country-label">
                  {t('reservation_form.address.country')}
                </InputLabel>
                <Select
                  labelId='country-label'
                  margin="dense"
                  label={t('reservation_form.address.country')}
                  disabled={isSubmitted}
                  value={personalInfo.country}
                  onChange={handleChange('country')}
                  error={!!getErrorMessage('country')}
                  helperText={getErrorMessage('country')}
                >
                  {options.map(({ label, value }) => (
                    <MenuItem key={value} value={label}>{label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
        <BottomButtonsWrapper justifyContent={{ xs: 'flex-end', md: 'center' }}>
          <Button
            href={previousStepUrl}
            size="large"
            sx={{ mr: { xs: 0.5, md: 1 } }}
          >
            {t('reservation_form.back')}
          </Button>
          <Button
            onClick={() => handleSubmitForm(nextStepUrl)}
            size="large"
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
        step={3}
        path={nextStepUrl}
      />
    </ThemeProvider>
  );
};

export default Address;
