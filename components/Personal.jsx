/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  InputGroup,
  FormTitle,
  BottomButtonsWrapper,
  Container
} from '../ReservationForm.styles';
import { ThemeProvider } from '../../../../contexts/theme';
import { t } from '../../../../../js/common/translations';
import {
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  PhoneInput,
  Button,
  Typography,
  SvgIcon
} from '../../../elements';
import {
  DesktopStepper,
  MobileStepper,
  TopStepper
} from '../ReservationFormComponents';
import { useBreakpoint } from '../../../../hooks/useBreakpoint';
import inputValidator from '../../../../utils/inputValidator';

const relationship = [
  {
    label: t('reservation_form.personal_info.relationship_options.divorced'),
    value: 'divorced'
  }, {
    label: t('reservation_form.personal_info.relationship_options.marriage'),
    value: 'married-common-law-marriage'
  }, {
    label: t('reservation_form.personal_info.relationship_options.single'),
    value: 'single'
  }, {
    label: t('reservation_form.personal_info.relationship_options.widowed'),
    value: 'widowed'
  }, {
    label: t('reservation_form.personal_info.relationship_options.other'),
    value: 'other'
  }
];

const INITIAL_PERSONAL_OBJ = {
  booking_id: '',
  full_name: '',
  email: '',
  phone_number: '',
  gender: '',
  relationship_status: '',
  birth_date: ''
};

const Personal = ({
  reservationInfo = INITIAL_PERSONAL_OBJ,
  previousStepUrl,
  nextStepUrl,
  reservationFormSubmitPath,
  formStatus
}) => {
  const mobile = ['xs', 'sm'].includes(useBreakpoint());
  const isSubmitted = formStatus === 'Submitted' || formStatus === 'Approved';
  const [errorsText, setErrorsText] = useState([]);
  const [birthdateError, setBirthdateError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    booking_id: reservationInfo.booking_id,
    full_name: reservationInfo.full_name,
    email: reservationInfo.email,
    phone_number: reservationInfo.phone_number,
    gender: reservationInfo.gender,
    relationship_status: reservationInfo.relationship_status,
    birth_date: reservationInfo.birth_date
  });

  const [guestInfo, setGuestInfo] = useState({
    full_name: reservationInfo.guests[0].guest.full_name,
    gender: reservationInfo.guests[0].guest.gender,
    birth_date: reservationInfo.guests[0].guest.birth_date
  });

  const formValidations = [
    ['email', { validation: 'email', errorMessage: t('form_errors.email_invalid') }],
    ['email', { validation: 'required', errorMessage: t('form_errors.empty_field') }],
    ['phone_number', { validation: () => personalInfo.phone_number.replace(/\D+/g, '').length > 7, errorMessage: t('form_errors.empty_field') }],
    ['gender', { validation: 'required', errorMessage: t('form_errors.empty_field') }],
    ['relationship_status', { validation: 'required', errorMessage: t('form_errors.empty_field') }],
    ['full_name', { validation: 'required', errorMessage: t('form_errors.empty_field') }],
    ['birth_date', { validation: 'required', errorMessage: t('form_errors.empty_field') }]
  ];

  useEffect(() => {
    const url = nextStepUrl.split('?')[0] + '?step=6';
    if (isSubmitted) {
      window.location.href = url;
    }
  }, [formStatus]);

  const handleChange = (inputName) => ({ target: { value } }) => {
    setPersonalInfo(state => ({
      ...state,
      [inputName]: value
    }));
  };

  const reservationFormData = (information, step) => {
    const formData = new FormData();
    const formDataInfo = { ...information };
    delete formDataInfo.booking_id;

    Object.entries(formDataInfo).forEach((value) => {
      formData.append(`reservation_form[${value[0]}]`, value[1]);
    });

    formData.append('reservation_form[status]', 1);
    formData.append('reservation_form[form_step]', step);

    return formData;
  };

  const guestData = (information) => {
    const formData = new FormData();
    formData.append('guest_id', reservationInfo.guests[0].guest_id);
    Object.entries(information).forEach((value) => {
      formData.append(`reservation_form_guest[${value[0]}]`, value[1]);
    });

    return formData;
  };

  const handleSubmitForm = async(url, step = 2) => {
    const reservationForm = reservationFormData(personalInfo, step);
    const reservationFormGuest = guestData(guestInfo);
    setLoading(true);
    const reservationFormGuestPath = `${window.location.origin}/reservation_form/${reservationInfo.id}/reservation_form_guests/${reservationInfo.guests[0].guest_id}`;
    const errors = inputValidator(personalInfo, formValidations);
    if (errors.length || (new Date(personalInfo.birth_date) > new Date())) {
      setLoading(false);
      setErrorsText(errors);

      if (new Date(personalInfo.birth_date) > new Date()) {
        setBirthdateError(true);
      }
    } else {
      try {
        await axios.patch(reservationFormSubmitPath, reservationForm);
        await axios.patch(reservationFormGuestPath, reservationFormGuest);
        window.location.href = url;
      } catch (e) {
        console.error(e);
      }
    }
  };

  const updateFormOwner = (inputName) => ({ target: { value } }) => {
    setPersonalInfo(state => ({
      ...state,
      [inputName]: value
    }));

    setGuestInfo(state => ({
      ...state,
      [inputName]: value
    }));
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
                porcentageValue={0}
                actualStep={1}
                title={t('reservation_form.personal_info.title')} />
            ) : (
              <Box width="100%" pr={1}>
                <DesktopStepper activeStep={0} path={nextStepUrl} />
              </Box>
            )}
          </Box>
          <Box mt={{ xs: 2, md: 4 }}>
            <FormTitle>{t('reservation_form.personal_info.title')}</FormTitle>
          </Box>
          <InputGroup>
            <TextField
              label={t('reservation_form.personal_info.id_booking')}
              margin="dense"
              disabled
              value={personalInfo?.booking_id}
            />
            <TextField
              label={t('reservation_form.personal_info.full_name')}
              margin="dense"
              error={!!getErrorMessage('full_name')}
              helperText={getErrorMessage('full_name')}
              disabled={isSubmitted}
              value={personalInfo?.full_name}
              sx={{ width: '100%', marginLeft: { xs: 0, md: 1 } }}
              onChange={updateFormOwner('full_name')}
            />
          </InputGroup>
          <InputGroup>
            <TextField
              label={t('reservation_form.personal_info.email')}
              margin="dense"
              error={!!getErrorMessage('email')}
              disabled={isSubmitted}
              helperText={getErrorMessage('email')}
              sx={{ width: '100%', marginRight: { xs: 0, md: 1 } }}
              value={personalInfo?.email}
              onChange={handleChange('email')}
            />
            <PhoneInput
              label={t('reservation_form.personal_info.phone')}
              margin="dense"
              telinput='true'
              sx={{ minWidth: { xs: '100%', md: 350 } }}
              type="tel"
              error={!!getErrorMessage('phone_number')}
              disabled={isSubmitted}
              helperText={getErrorMessage('phone_number')}
              placeholder="11 12345 6789"
              value={personalInfo.phone_number}
              onChange={(value) => handleChange('phone_number')({ target: { value } })}
            />
          </InputGroup>
          <InputGroup alignItems="flex-start" mt={0.5}>
            <FormControl
              fullWidth
              sx={{
                marginRight: { xs: 0, md: 1 },
                mt: 0
              }}
            >
              <InputLabel id="gender-select">{t('reservation_form.personal_info.gender')}</InputLabel>
              <Select
                label="gender"
                labelId="gender-select"
                disabled={isSubmitted}
                value={personalInfo?.gender}
                error={!!getErrorMessage('gender')}
                onChange={updateFormOwner('gender')}
                sx={{ width: '100%' }}
              >
                {['male', 'female', 'non_binary', 'other'].map((value, index) => (
                  <MenuItem key={index} value={value}>
                    {t(`reservation_form.personal_info.gender_options.${value}`)}
                  </MenuItem>
                ))}
              </Select>
              {!!getErrorMessage('gender') && (
                <Box display="flex" mt={0.25}>
                  <SvgIcon name="error_input_icon" />
                  <Typography fontSize={12} ml={0.25} color="error.main">{getErrorMessage('gender')}</Typography>
                </Box>)}
            </FormControl>
            <FormControl
              fullWidth
              sx={{
                width: '100%',
                marginTop: { xs: '1rem', md: 0 }
              }}>
              <InputLabel id="relationship-select">{t('reservation_form.personal_info.relationship')}</InputLabel>
              <Select
                label="relationship"
                labelId="relationship"
                disabled={isSubmitted}
                error={!!getErrorMessage('relationship_status')}
                value={personalInfo?.relationship_status}
                onChange={handleChange('relationship_status')}
                sx={{ width: '100%', height: 56, marginTop: 0 }}
              >
                {relationship.map(({ label, value }, index) => (
                  <MenuItem key={index} value={value}>{label}</MenuItem>
                ))}
              </Select>
              {!!getErrorMessage('relationship_status') && (
                <Box display="flex" mt={0.25}>
                  <SvgIcon name="error_input_icon" />
                  <Typography fontSize={12} ml={0.25} color="error.main">{getErrorMessage('relationship_status')}</Typography>
                </Box>
              )}
            </FormControl>
            <Box width="100%" mt={{ xs: 1, md: -0.50 }} ml={{ xs: 0, md: 1 }} >
              <TextField
                label={t('reservation_form.personal_info.birthday')}
                margin="dense"
                InputProps={{ inputProps: { max: '2999-12-31' } }}
                disabled={isSubmitted}
                error={!!getErrorMessage('birth_date') || birthdateError}
                value={personalInfo?.birth_date}
                onChange={updateFormOwner('birth_date')}
                type="date"
                sx={{
                  width: '100%',
                  '& img': {
                    display: 'none'
                  }
                }}
              />
              {(!!getErrorMessage('birth_date') || birthdateError) && (
                <Box display="flex">
                  <SvgIcon name="error_input_icon" />
                  <Typography fontSize={12} ml={0.25} color="error.main">{getErrorMessage('birth_date') || t('reservation_form.birth_date_error')}</Typography>
                </Box>
              )}
            </Box>
          </InputGroup>
        </Box>
        <BottomButtonsWrapper justifyContent={{ xs: 'flex-end', md: 'center', pr: '4px' }}>
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
    </ThemeProvider>
  );
};

export default Personal;
