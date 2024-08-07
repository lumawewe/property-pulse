/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { Box, Button, FormControl, InputLabel, Select, SvgIcon, TextField, Typography, MenuItem } from '../../../elements';
import { FormTitle, InputGroup, UploadBox, UploadFileInput, Container, BottomButtonsWrapper } from '../ReservationForm.styles';
import { t } from '../../../../../js/common/translations';
import { ThemeProvider } from '../../../../contexts/theme';
import countryList from 'react-select-country-list';
import { useBreakpoint } from '../../../../hooks/useBreakpoint';
import { DesktopStepper, FinishLaterModal, MobileStepper, TopStepper } from '../ReservationFormComponents';
import inputValidator from '../../../../utils/inputValidator';
import copyToClipboard from '../../../../utils/copyToClipboard';

const PhotoPreview = ({
  src,
  deletePhoto,
  index,
  fileName,
  setPreviewUrl
}) => {
  const handlePhotoDelete = (index) => {
    setPreviewUrl('');
    deletePhoto(index);
  };

  return (
    <Box sx={{ position: 'relative' }} display="flex" justifyContent='space-between' width="100%">
      <Box display="flex" alignItems="center">
        <Box
          component='img'
          src={src}
          width={74}
        />
        <Typography ml={0.5}>{fileName}</Typography>
      </Box>
      <SvgIcon
        onClick={() => handlePhotoDelete(index)}
        width={40}
        name="close_icon"
        height={40}
        sx={{ top: '3px', right: '3px' }}
      />
    </Box>
  );
};

const INITIAL_GUEST_OBJ = {
  guestInfo: {
    guest: {
      full_name: '',
      birth_date: '',
      gender: '',
      nationality: '',
      id_number: ''
    }
  }
};

const AdditionalGuests = ({
  reservationInfo,
  previousStepUrl,
  nextStepUrl,
  reservationFormSubmitPath,
  guestInfo = INITIAL_GUEST_OBJ,
  guestNextStepUrl,
  guestPreviousStepUrl,
  guestNumber,
  currGuestsCount,
  formStatus
}) => {
  const mobile = ['xs', 'sm'].includes(useBreakpoint());
  const [openFinishLater, setOpenFinishLater] = useState(false);
  const [errorsText, setErrorsText] = useState([]);
  const [cpfError, setCpfError] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestFillError, setGuestFillError] = useState(false);
  const [birthdateError, setBirthdateError] = useState(false);
  const options = countryList().getData();
  const isSubmitted = formStatus === 'Submitted' || formStatus === 'Approved';
  const [guest, setGuest] = useState({
    full_name: guestInfo.guest?.full_name,
    birth_date: guestInfo.guest?.birth_date,
    gender: guestInfo.guest?.gender,
    nationality: guestInfo.guest?.nationality,
    id_number: guestInfo.guest?.id_number
  });

  const formValidations = [
    ['full_name', { validation: 'required', errorMessage: t('form_errors.empty_field') }],
    ['id_number', { validation: 'required', errorMessage: t('form_errors.empty_field') }],
    ['nationality', { validation: 'required', errorMessage: t('form_errors.empty_field') }]
  ];

  const [images, setImages] = useState([
    {
      file: '',
      title: 'guest_selfie'
    },
    {
      file: '',
      title: 'guest_document'
    }
  ]);
  const [selfieUrl, setSelfieUrl] = useState(guestInfo?.selfie_photo || '');
  const [documentUrl, setDocumentUrl] = useState(guestInfo?.document_photo || '');
  const urlPage = document.location.href;

  const maskCPF = (value = '') => {
    if (typeof value !== 'string') return;

    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };
  useEffect(() => {
    const url = nextStepUrl.split('?')[0] + '?step=6';
    if (isSubmitted) {
      window.location.href = url;
    }
  }, [formStatus]);

  const navigateBack = () => {
    window.location.href = previousStepUrl;
  };

  const navigateToPreviousGuest = () => {
    window.location.href = guestPreviousStepUrl;
  };

  const guestData = (guest, images) => {
    const formData = new FormData();

    Object.entries(guest).forEach((value) => {
      if (value[1]) formData.append(`reservation_form_guest[${value[0]}]`, value[1]);
    });

    images.forEach((image) => {
      formData.append('images[files][][file]', image.file);
      formData.append('images[files][][title]', image.title);
    });

    return formData;
  };

  const fireGuestRequest = () => {
    const reservationFormGuest = guestData(guest, images);
    const guestId = guestInfo?.guest_id ? `/${guestInfo.guest_id}` : '';
    const reservationFormGuestPath = `${window.location.origin}/reservation_form/${reservationInfo.id}/reservation_form_guests${guestId}`;
    const axiosRequestMethod = guestInfo?.guest_id ? 'patch' : 'post';
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    return axios[axiosRequestMethod](reservationFormGuestPath, reservationFormGuest, config);
  };

  useEffect(() => {
    if (reservationInfo.guests_count === 1) {
      window.location.href = nextStepUrl;
    }
  }, [reservationInfo.guests_count]);

  const handleSubmitForm = async(status, path, finishLater = false) => {
    const statusData = new FormData();
    const errors = inputValidator(guest, formValidations);
    setLoading(true);
    statusData.append('reservation_form[status]', status);
    statusData.append('reservation_form[form_step]', 5);

    if ((errors.length ||
      (guest.nationality === 'Brazil' && guest.id_number.length < 11) ||
      (new Date(guest.birth_date) > new Date()) ||
      ((reservationInfo.guests_count !== guestNumber + 1 &&
        path !== guestNextStepUrl) &&
        reservationInfo.guests.length !== reservationInfo.guests_count)) &&
      !finishLater) {
      setLoading(false);
      setErrorsText(errors);

      if ((reservationInfo.guests_count !== guestNumber + 1 &&
        path !== guestNextStepUrl) &&
        reservationInfo.guests.length !== reservationInfo.guests_count) {
        setGuestFillError(true);
      }

      if (guest.nationality === 'Brazil' && guest.id_number.length < 11) {
        setCpfError(t('reservation_form.guests.cpf_error'));
      }

      if (new Date(guest.birth_date) > new Date()) {
        setBirthdateError(true);
      }
    } else {
      try {
        await fireGuestRequest();
        await axios.patch(reservationFormSubmitPath, statusData);
        window.location.href = path;
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleGuestInfoChange = (inputName) => ({ target: { value } }) => {
    setGuest((state) => ({
      ...state,
      [inputName]: value
    }));
  };

  const handleImageChange = (index, title) => (files) => {
    setImages(state => {
      const file1Copy = { ...state[0] };
      const file2Copy = { ...state[1] };

      const stateCopy = [file1Copy, file2Copy];

      stateCopy[index] = {
        file: files[0],
        title: title
      };

      return stateCopy;
    });
  };

  const deleteImage = (index) => {
    setImages(state => {
      const file1Copy = { ...state[0] };
      const file2Copy = { ...state[1] };

      const stateCopy = [file1Copy, file2Copy];

      stateCopy[index] = {
        ...stateCopy[index],
        file: ''
      };

      return stateCopy;
    });
  };

  useEffect(() => {
    if (images[0].file) setSelfieUrl(URL.createObjectURL(images[0].file));
    if (images[1].file) setDocumentUrl(URL.createObjectURL(images[1].file));
  }, [images]);

  const getFileName = (file, title) => {
    if (typeof file === 'object') {
      return file.path;
    } else {
      return title;
    }
  };

  useEffect(() => {
    if (guest.nationality === 'Brazil') {
      setGuest((state) => ({ ...state, id_number: maskCPF(guest.id_number) }));
    }
  }, [guest.nationality]);

  const getErrorMessage = (inputName) => {
    return errorsText.filter(el => el.field === inputName)[0]?.error;
  };

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
          <Box>
            <Box
              width="100%"
              display="flex"
              justifyContent="center"
              pt={{ xs: 1, md: 5 }}
              pb={{ xs: 2, md: 5 }}
            >
              <TopStepper />
            </Box>
            {mobile ? (
              <MobileStepper
                porcentageValue={80}
                actualStep={5}
                title={t('reservation_form.guests.title')} />
            ) : (
              <DesktopStepper activeStep={4} path={nextStepUrl} />
            )}
          </Box>
          <Box mt={{ xs: 2, md: 4 }}>
            <Typography>{t('reservation_form.guests.form_title', { number: guestNumber + 1 })}</Typography>
            <Box
              display="flex"
              mt={1}
              flexDirection={{ xs: 'column', md: 'row' }}
            >
              <TextField
                label={t('reservation_form.personal_info.full_name')}
                error={!!getErrorMessage('full_name')}
                helperText={getErrorMessage('full_name')}
                sx={{ mr: 0.5, width: '100%' }}
                value={guest.full_name}
                disabled={isSubmitted}
                onChange={handleGuestInfoChange('full_name')}
              />
              <TextField
                label={t('reservation_form.personal_info.birthday')}
                type="date"
                disabled={isSubmitted}
                error={birthdateError}
                helperText={t('reservation_form.birth_date_error')}
                onChange={handleGuestInfoChange('birth_date')}
                InputProps={{ inputProps: { max: '2999-12-31' } }}
                sx={{
                  width: '100%',
                  marginLeft: { xs: 0, md: 0.5 },
                  marginTop: { xs: 1, md: 0 }
                }}
                value={guest.birth_date}
              />
            </Box>
            <Box display="flex" width="100%" mt={1} flexDirection={{ xs: 'column', md: 'row' }}>
              <FormControl
                fullWidth
                sx={{
                  width: '100%',
                  marginRight: { xs: 0, md: 1 },
                  mt: 0
                }}
              >
                <InputLabel id="gender-select">{t('reservation_form.personal_info.gender')}</InputLabel>
                <Select
                  label="gender"
                  name="landlord_contact[city]"
                  labelId="gender-select"
                  disabled={isSubmitted}
                  value={guest.gender}
                  sx={{ width: '100%', height: 56 }}
                  onChange={handleGuestInfoChange('gender')}
                >
                  {['male', 'female', 'non_binary', 'other'].map((value, index) => (
                    <MenuItem key={index} value={value}>
                      {t(`reservation_form.personal_info.gender_options.${value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ width: '100%', mr: 1 }} >
                <InputLabel id="nationality-label" sx={{ marginTop: { xs: 1, md: 0 } }}>
                  {t('reservation_form.nationality.nationality')}
                </InputLabel>
                <Select
                  labelId='nationality-label'
                  margin="dense"
                  label={t('reservation_form.nationality.nationality')}
                  disabled={isSubmitted}
                  value={guest.nationality}
                  error={!!getErrorMessage('nationality')}
                  onChange={handleGuestInfoChange('nationality')}
                  sx={{ width: '100%', mt: { xs: 1, md: 0 } }}
                >
                  {options.map(({ label, value }) => (
                    <MenuItem key={value} value={label}>{label}</MenuItem>
                  ))}
                </Select>
                {!!getErrorMessage('nationality') && (
                  <Box display="flex" mt={0.25}>
                    <SvgIcon name="error_input_icon" />
                    <Typography fontSize={12} ml={0.25} color="red">{getErrorMessage('nationality')}</Typography>
                  </Box>
                )}
              </FormControl>
              <Box width="100%">
                <TextField
                  label={t(`reservation_form.nationality.${guest.nationality === 'Brazil' ? 'cpf' : 'document_number'}`)}
                  value={(guest.nationality === 'Brazil') ? maskCPF(guest.id_number) : guest.id_number}
                  disabled={isSubmitted}
                  error={!!getErrorMessage('id_number') || !!cpfError}
                  helperText={getErrorMessage('id_number')}
                  onChange={handleGuestInfoChange('id_number')}
                  sx={{
                    width: '100%',
                    mt: { xs: 1, md: 0 },
                    '& p': { display: getErrorMessage('id_number') ? 'block' : 'none' }
                  }}
                />
                {!!cpfError && (
                  <Box display="flex" mt={0.25}>
                    <SvgIcon name="error_input_icon" />
                    <Typography fontSize={12} ml={0.25} color="red">{cpfError}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box>
              <InputGroup column>
                <FormTitle mt={0.5}>{t(`reservation_form.nationality.rne_passport_upload_title${guest.nationality === 'Brazil' ? '_brazil' : ''}`)}</FormTitle>
                <Typography
                  fontSize={'0.75rem'}
                  sx={{ color: 'primary.70' }}
                  mb={0.5}
                >
                  {t('reservation_form.nationality.rne_passport_upload_subtitle')}
                </Typography>
                <Dropzone
                  accept={{ 'image/png': ['.png', '.jpg', '.jpeg'] }}
                  disabled={!!documentUrl}
                  onDrop={handleImageChange(1, 'guest_document')}
                  style={{ dropzoneActive: { opacity: 0.8 }, marginBottom: 1 }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <>
                      <UploadFileInput sx={{ width: '100%' }} htmlFor="file-upload">
                        <UploadBox {...getRootProps({
                          className: 'dropzone'
                        })}>
                          {documentUrl ? (
                            <>
                              <SvgIcon name="success_large" width={74} height={74} />
                              <Typography>{t('reservation_form.file_upload_success')}</Typography>
                            </>
                          ) : (
                            <>
                              <SvgIcon name="file_upload" width={74} height={74} />
                              <Typography
                                fontSize='0.75rem'
                                sx={{ color: 'primary.70' }}
                                mb={0.5}
                              >
                                {t('reservation_form.nationality.upload_field_text')}
                              </Typography>
                            </>
                          )}
                        </UploadBox>
                        <input
                          id="file-upload"
                          type="file"
                          margin="dense"
                          disabled={!!documentUrl}
                          {...getInputProps()}
                          sx={{ display: 'none' }}
                        />
                      </UploadFileInput>
                    </>
                  )}
                </Dropzone>
                <Box display='flex' alignItems='center'>
                  {documentUrl &&
                    <PhotoPreview
                      src={documentUrl}
                      deletePhoto={deleteImage}
                      index={1}
                      fileName={getFileName(images[1].file, 'guest_document')}
                      setPreviewUrl={setDocumentUrl}
                    />
                  }
                </Box>
              </InputGroup>
              <InputGroup column pb={1}>
                <FormTitle mt={0.5}>{t('reservation_form.nationality.selfie_title')}</FormTitle>
                <Typography
                  fontSize={12}
                  mb={0.5}
                  sx={{ color: 'primary.70' }}
                >
                  {t('reservation_form.nationality.selfie_subtitle')}
                </Typography>
                <Dropzone
                  accept={{ 'image/png': ['.png', '.jpg', '.jpeg'] }}
                  disabled={!!selfieUrl}
                  onDrop={handleImageChange(0, 'guest_selfie')}
                  style={{ dropzoneActive: { opacity: 0.8 }, marginBottom: 1 }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <>
                      <UploadFileInput
                        sx={{ width: '100%' }}
                        htmlFor="file-upload2">
                        <UploadBox {...getRootProps({
                          className: 'dropzone'
                        })}
                        >
                          {selfieUrl ? (
                            <>
                              <SvgIcon name="success_large" width={74} height={74} />
                              <Typography>{t('reservation_form.file_upload_success')}</Typography>
                            </>
                          ) : (
                            <>
                              <SvgIcon name="file_upload" width={74} height={74} />
                              <Typography fontSize={12} mb={0.5} sx={{ color: 'primary.70' }}>
                                {t('reservation_form.nationality.upload_field_text')}
                              </Typography>
                            </>
                          )}
                        </UploadBox>
                        <input
                          id="file-upload2"
                          type="file"
                          margin="dense"
                          disabled={!!selfieUrl}
                          {...getInputProps()}
                          sx={{ display: 'none' }}
                        />
                      </UploadFileInput>
                    </>
                  )}
                </Dropzone>
                <Box sx={{ my: 1 }}>
                  {selfieUrl &&
                    <PhotoPreview
                      src={selfieUrl}
                      deletePhoto={deleteImage}
                      index={0}
                      fileName={getFileName(images[0].file, 'guest_selfie')}
                      setPreviewUrl={setSelfieUrl}
                    />
                  }
                </Box>
                {guestFillError && (
                  <Box display="flex">
                    <SvgIcon name="error_input_icon" />
                    <Typography fontSize={12} ml={0.25} color="red">{t('reservation_form.guests.guests_fill_error')}</Typography>
                  </Box>
                )}
                <Box mt={1} ml={{ xs: 0, md: 'auto', display: 'flex' }}>
                  {(guestPreviousStepUrl) &&
                    <Button onClick={navigateToPreviousGuest} sx={{ mr: 1 }} size="large">
                      <Typography fontSize={14}>{t('reservation_form.guests.previous_guest')}</Typography>
                    </Button>
                  }
                  {(guestNextStepUrl) &&
                    <Button
                      onClick={() => handleSubmitForm(1, guestNextStepUrl)}
                      size="large"
                      disabled={isSubmitted && (guestNumber + 1 > currGuestsCount)}
                    >
                      <Typography fontSize={14}>
                        {(guestNumber + 1 < currGuestsCount)
                          ? t('reservation_form.guests.next_guest')
                          : t('reservation_form.guests.another_guest')
                        }
                      </Typography>
                    </Button>
                  }
                </Box>
              </InputGroup>
            </Box>
          </Box>
        </Box>
        <BottomButtonsWrapper flexDirection={{ xs: 'column', md: 'row' }} lastStep>
          <Button
            size="large"
            sx={{ position: { xs: 'block', md: 'absolute' }, right: 0, mb: { xs: 1, sm: 0 } }}
            variant="outline"
            onClick={() => copyToClipboard(urlPage)}
          >
            {t('reservation_form.guests.copy_button')}
          </Button>
          <Box display="flex" width='100%' justifyContent={{ xs: 'flex-end', md: 'center' }} >
            <Button
              size="large"
              sx={{ position: 'absolute', left: { xs: -16, md: -8 } }}
              variant="outline"
              onClick={() => setOpenFinishLater(true)}
            >
              {t('reservation_form.finish_later')}
            </Button>
            <Button
              onClick={() => navigateBack()}
              size="large"
              sx={{ mr: { xs: 0.5, md: 1 } }}>
              {t('reservation_form.back')}
            </Button>
            <Button onClick={() => handleSubmitForm(2, nextStepUrl)} size="large"
              loading={loading}
              disabled={loading}>
              {t('reservation_form.finish')}
            </Button>
          </Box>
        </BottomButtonsWrapper>
        <FinishLaterModal
          open={openFinishLater}
          close={setOpenFinishLater}
          submit={handleSubmitForm}
          status={1}
          path={nextStepUrl}
        />
      </Container>
    </ThemeProvider>
  );
};

export default AdditionalGuests;
