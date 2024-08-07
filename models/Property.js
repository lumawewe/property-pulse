import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '../contexts/theme';
import {
  Accordion,
  Box,
  Button,
  Container,
  FormControl,
  HtmlTranslation,
  InputLabel,
  MenuItem,
  Select,
  SvgIcon,
  Typography
} from '../UI/elements';
import {
  HeroContainer,
  HeroImg,
  HeroTextWrapper,
  HeroTitle,
  HeroSubtitle,
  FilterWrapper,
  Sections,
  Title,
  Subtitle,
  ButtonsWrapper,
  BarWrapper,
  TestimonialsSection,
  FurnishedApartmentTitles,
  TopChoicesTextWrapper,
  TopChoicesPictures,
  EasyRentalBox,
  EasyRentalTitle,
  EasyRentalSubtitle,
  SectionSides
} from './FurnishedApartments.styles';
import HeroPicture from '../../images/hero_mvp.png';
import SectionLeftPicture from '../../images/furnished_apartments/section_left_img.png';
import SectionRightPictureOne from '../../images/furnished_apartments/section_right_img1.png';
import SectionRightPictureTwo from '../../images/furnished_apartments/section_right_img2.png';
import { PropertyTabs, FeedbackSlider, Tabs } from '../UI/modules';
import { t } from '../../js/common/translations';

const features = [
  {
    title: t('amenities.wi_fi'),
    iconName: 'property_wifi'
  },
  {
    title: t('amenities.bath_products'),
    iconName: 'property_bath_products'
  },
  {
    title: t('amenities.microwave_oven'),
    iconName: 'property_microwave'
  },
  {
    title: t('amenities.microwave'),
    iconName: 'property_microwave'
  },
  {
    title: t('amenities.smart_tv'),
    iconName: 'property_smart_tv'
  },
  {
    title: t('amenities.linen_towels'),
    iconName: 'property_linen_towels'
  },
  {
    title: t('amenities.air'),
    iconName: 'property_ac_unit'
  },
  {
    title: t('amenities.portable_ac'),
    iconName: 'property_ac_unit'
  },
  {
    title: t('amenities.cleaning_service'),
    iconName: 'property_brush',
    tooltip: t('amenities.cleaning_service_tooltip')
  },
  {
    title: t('amenities.equipped_for_cooking'),
    iconName: 'property_cutlery'
  },
  {
    title: t('amenities.balcony'),
    iconName: 'property_balcony'
  },
  {
    title: t('amenities.washing_machine'),
    iconName: 'property_washing_machine'
  },
  {
    title: t('amenities.washing_machine_nodryer'),
    iconName: 'property_washing_machine'
  },
  {
    title: t('amenities.coffee_machine'),
    iconName: 'property_coffee_machine'
  },
  {
    title: t('amenities.sea_view'),
    iconName: 'sea_view'
  },
  {
    title: t('amenities.private_pool'),
    iconName: 'private_pool'
  },
  {
    title: t('amenities.ceiling_fan'),
    iconName: 'ceiling_fan'
  },
  {
    title: t('amenities.oven'),
    iconName: 'property_microwave'
  },
  {
    title: t('amenities.stove'),
    iconName: 'property_microwave'
  },
  {
    title: t('amenities.accessible_bathroom'),
    iconName: 'wheelchair'
  }
];

const faq = [
  {
    title: t('furnished_apartments.first_question'),
    description: t('furnished_apartments.first_answer')
  },
  {
    title: t('furnished_apartments.second_question'),
    description: t('furnished_apartments.second_answer')
  },
  {
    title: t('furnished_apartments.third_question'),
    description: t('furnished_apartments.third_answer')
  }
];

const getInfoPic = (citySlug, propertiesByCity, cities) => {
  const cityIndex = cities.findIndex((city) => city.slug === citySlug);

  return [
    {
      src: propertiesByCity[cityIndex]?.properties[0]?.photos[0],
      width: { xs: '100%', md: '200px' }
    },
    {
      title: t(`furnished_apartments.${citySlug}_comment_title_html`),
      quote: t(`furnished_apartments.${citySlug}_comment_one`),
      width: { xs: '100%', md: '200px' }
    },
    {
      src: propertiesByCity[cityIndex]?.properties[1]?.photos[0],
      width: { xs: '100%', md: '470px' }
    },
    {
      src: propertiesByCity[cityIndex]?.properties[2]?.photos[0],
      width: { xs: '100%', md: '470px' }
    },
    {
      title: t(`furnished_apartments.${citySlug}_comment_title_html`),
      quote: t(`furnished_apartments.${citySlug}_comment_two`),
      width: { xs: '100%', md: '200px' }
    },
    {
      src: propertiesByCity[cityIndex]?.properties[3]?.photos[0],
      width: { xs: '100%', md: '200px' }
    }
  ];
};

const FurnishedApartments = ({
  highlightedPropertiesByCity,
  feedbacks,
  cities,
  cityNeighbourhoods,
  allAmenities,
  faqPath
}) => {
  const [currentCityTab, setCurrentCityTab] = useState(0);
  const [state, setState] = useState('sao-paulo');
  const [city, setCity] = useState(cities[0].slug);
  const [neighbourhood, setNeighbourhood] = useState('');
  const [amenities, setAmenities] = useState();

  const handleCityChange = (choosenCity) => {
    choosenCity !== city && setNeighbourhood('');
    setCity(choosenCity);
  };

  useEffect(() => {
    currentCityTab === 0 && setState('sao-paulo');
    currentCityTab === 1 && setState('rio-de-janeiro');
    currentCityTab === 2 && setState('brasilia');
  }, [currentCityTab]);

  return (
    <ThemeProvider>
      <Box backgroundColor="secondary.light">
        <HeroContainer className="hero">
          <HeroImg component="picture">
            <HeroImg component="img" src={HeroPicture} />
          </HeroImg>
          <HeroTextWrapper>
            <HeroTitle component='h1'><HtmlTranslation text={t('furnished_apartments.hero_title_html')} /></HeroTitle>
            <HeroSubtitle component='span'>{t('furnished_apartments.hero_subtitle')} </HeroSubtitle>
            <Container p={{ xs: 1, md: 0 }}>
              <FilterWrapper>
                <FormControl sx={{ width: { xs: '100%', md: '254px' } }} >
                  <InputLabel id='city'>{t('furnished_apartments.city')}</InputLabel>
                  <Select
                    label={t('furnished_apartments.city')}
                    width='254px'
                    labelId='city'
                    mx={1}
                    defaultValue={city}
                    onChange={e => handleCityChange(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    }}
                  >
                    {cities.map((item, i) => (
                      <MenuItem key={i} value={item.slug}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ mx: { xs: 0, md: 1 }, width: { xs: '100%', md: '254px' } }}>
                  <InputLabel id='neighbourhood'>{t('furnished_apartments.neighbourhood')}</InputLabel>
                  <Select
                    width='254px'
                    onChange={e => setNeighbourhood(e.target.value)}
                    label={t('furnished_apartments.neighbourhood')}
                    disabled={!city}
                    defaultValue=""
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    }}
                  >
                    {cityNeighbourhoods[city]?.map((item, i) => (
                      <MenuItem key={i} value={item[1]}>{item[0]}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ width: { xs: '100%', md: '254px' }, mb: { xs: 1, md: 0 } }}>
                  <InputLabel id='amenities'>{t('furnished_apartments.amenities')}</InputLabel>
                  <Select
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    }}
                    label={t('furnished_apartments.amenities')}
                    width='254px'
                    labelId='amenities'
                    mx={1}
                    defaultValue=""
                    onChange={e => setAmenities(e.target.value)}
                  >
                    {allAmenities.map((item, i) => (
                      <MenuItem key={i} value={item.slug}>{item.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  width="158px"
                  href={
                    'apartments/' + (city || 'sao-paulo') +
                    (neighbourhood ? `?search[neighbourhoods][]=${neighbourhood}` : '') +
                    (amenities ? `${neighbourhood ? '&' : '?'}search[facilities][]=${amenities}` : '')
                  }
                >
                  <SvgIcon name='search_white' mr={0.5} />
                  {t('furnished_apartments.search')}
                </Button>
              </FilterWrapper>
            </Container>
          </HeroTextWrapper>
        </HeroContainer>
        <Container
          sx={{
            zIndex: 1,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginTop: { xs: 0, md: '-5rem' },
            p: { xs: 1, md: 0 }
          }}
          disableGutters
        >
          <Sections className="apartment-by-city">
            <Title component='h2'>
              <HtmlTranslation text={t('furnished_apartments.top_choices_title_html')} />
            </Title>
            <Subtitle component='span'>{t('furnished_apartments.top_choices_subtitle')}</Subtitle>
            <ButtonsWrapper>
              <Tabs
                currentTab={currentCityTab}
                onTabClick={(tabIndex) => setCurrentCityTab(tabIndex)}
                showTab={true}
                scroll
                data={cities.map((city) => ({
                  label: city.name,
                  content: (
                    <Box
                      display='flex'
                      sx={{
                        flexWrap: 'wrap',
                        marginTop: 2,
                        justifyContent: 'center',
                        gap: 1.5,
                        mb: 2
                      }}
                    >
                      {getInfoPic(city.slug, highlightedPropertiesByCity, cities).map((item, i) => (
                        item.src ? (
                          <TopChoicesPictures key={i} component='picture' width={item.width}>
                            <TopChoicesPictures component='img' src={item.src} width={item.width} />
                          </TopChoicesPictures>
                        ) : (
                          <TopChoicesTextWrapper key={i} width={item.width}>
                            <HtmlTranslation component='span' fontFamily='Cambon' text={item.title} />
                            <Typography component='span' fontFamily='Cambon' fontSize='1.625rem' fontWeight={800}>
                              {item.quote}
                            </Typography>
                          </TopChoicesTextWrapper>
                        )
                      ))}
                    </Box>
                  )
                }))}
              />
            </ButtonsWrapper>
            <BarWrapper>
              <Typography sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                {t('furnished_apartments.explore_apartments_html')}
                <b>{t(`furnished_apartments.${state}_name`)}</b>
              </Typography>
              <Button
                href={'apartments/' + state}
                sx={{
                  mt: { xs: 1, md: 0 },
                  width: { xs: '100%', md: 'auto' },
                  backgroundColor: 'error.70',
                  '&:hover': {
                    backgroundColor: 'error.70',
                    opacity: '50%'
                  }
                }}>
                {t('furnished_apartments.choose_button')}
              </Button>
            </BarWrapper>
          </Sections>
          <Box width="100%" className="apartment-by-release" display="flex" flexDirection="column" justifyContent='center'>
            <Title component='h2' mt={2}> <HtmlTranslation text={t('furnished_apartments.try_latest_title_html')} /> </Title>
            <Subtitle component='span' mb={2}> <HtmlTranslation text={t('furnished_apartments.try_latest_subtitle_html')} /> </Subtitle>
            <PropertyTabs
              tabs={highlightedPropertiesByCity.map(city => ({ ...city, label: city.name }))}
              activeTab={currentCityTab}
              onTabActiveChange={(tabIndex) => setCurrentCityTab(tabIndex)}
              mt={2}
            />
          </Box>
          <Sections mt={4} className="tabas-signature">
            <Title component='h2'><HtmlTranslation text={t('furnished_apartments.furnished_signature_title_html')} /></Title>
            <Subtitle component='span'>{t('furnished_apartments.furnished_signature_subtitle')}</Subtitle>
            <Box
              display="flex"
              justifyContent='space-around'
              textAlign="left"
              flexDirection={{ xs: 'column', md: 'row' }}
              width="100%"
              mt={2.5}
            >
              <SectionSides>
                <Box name="text" mb={2}>
                  <FurnishedApartmentTitles component='h3'>
                    <HtmlTranslation component='p' text={t('furnished_apartments.home_office_html')} />
                  </FurnishedApartmentTitles>
                  <Typography component='p'>
                    <HtmlTranslation text={t('furnished_apartments.home_office_description_html')} />
                  </Typography>
                </Box>
                <Box
                  width={{ xs: '100%', md: 387 }}
                  component="img"
                  src={SectionLeftPicture}
                />
                <Box name="text" mb={2}>
                  <FurnishedApartmentTitles component='h3'>
                    {t('furnished_apartments.pet_owner')}
                  </FurnishedApartmentTitles>
                  <Typography component='p'>
                    <HtmlTranslation text={t('furnished_apartments.pet_owner_description_html')} />
                  </Typography>
                </Box>
              </SectionSides>
              <SectionSides>
                <Box
                  component='img'
                  width={{ xs: '100%', md: 387 }}
                  src={SectionRightPictureOne}
                />
                <Box name="text" mb={2}>
                  <FurnishedApartmentTitles component='h3'>
                    {t('furnished_apartments.family_living')}
                  </FurnishedApartmentTitles>
                  <Typography component='p'>
                    <HtmlTranslation text={t('furnished_apartments.family_living_description_html')} />
                  </Typography>
                </Box>
                <Box
                  component="img"
                  width={{ xs: '100%', md: 387 }}
                  src={SectionRightPictureTwo}
                />
              </SectionSides>
            </Box>
          </Sections>
          <Box display='flex' flexDirection='column' alignItems='center' mt={2} p={{ xs: 1, md: 0 }} className="apartment-amenities">
            <Title mb={3} component='h2'><HtmlTranslation text={t('furnished_apartments.apartment_amenities_html')} /></Title>
            <Box
              display='grid'
              width='100%'
              justifyContent="center"
              gridTemplateColumns={{ xs: 'auto auto', md: '320px 320px 230px' }}
              gap={1}
            >
              {features.map((item, i) => (
                <Box key={i} mb={1} display='flex'>
                  <SvgIcon name={item.iconName} mr={1} size={22} sx={{ width: { xs: 20, md: 'auto' } }} />
                  <Typography>{item.title}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <EasyRentalBox className="cta-reasons">
            <Box>
              <EasyRentalTitle component='h2'>
                {t('furnished_apartments.easy_rental_title')}
              </EasyRentalTitle>
              <EasyRentalSubtitle component='span'>
                {t('furnished_apartments.easy_rental_subtitle')}
              </EasyRentalSubtitle>
            </Box>
            <Box position='absolute' bottom={-20} display='flex'>
              <Button
                data-bs-toggle="modal"
                data-bs-target="#modalCity"
                sx={{ mx: 1, textTransform: 'uppercase' }}
              >
                {t('furnished_apartments.find_apartment_button')}
              </Button>
              <Button
                color="secondary"
                onClick={() => (
                  document.getElementById('testimonials').scrollIntoView({ behavior: 'smooth' })
                )}
                sx={{ mx: 1, textTransform: 'uppercase' }}
              >
                {t('furnished_apartments.learn_more_button')}
              </Button>
            </Box>
          </EasyRentalBox>
          <Box id="testimonials" className="slider-reviews">
            {!!feedbacks?.length && (
              <TestimonialsSection
                backgroundColor={'background.default'}
                sx={{ py: 3 }}
              >
                <Container sx={{ height: 1, marginTop: '1rem' }}>
                  <Typography
                    variant="h1"
                    component="h2"
                    align="center"
                    sx={{ fontFamily: 'Cambon' }}
                  >
                    {t('home_page.feedbacks.title')}
                  </Typography>
                  <Box mt={1} sx={{ flex: 1 }}>
                    <FeedbackSlider feedbacks={feedbacks} />
                  </Box>
                </Container>
              </TestimonialsSection>
            )}
          </Box>
          <Box backgroundColor='secondary.dark'>
            <Box p={1} className="faq">
              <Title component="h2"><HtmlTranslation text={t('furnished_apartments.in_doubt_title_html')} /></Title>
              {faq.map((item, i) => (
                <Box key={i} sx={{ width: '100%' }}>
                  <Accordion
                    sx={{
                      boxShadow: 'none',
                      marginBottom: 0
                    }}
                    defaultExpanded
                    accordionSummaryContent={
                      <FurnishedApartmentTitles component='h3' style={{ marginBottom: 0 }}>
                        {item.title}
                      </FurnishedApartmentTitles>
                    }
                    accordionDetailsContent={
                      <Box sx={{ mb: 1.5 }} component='p'>
                        {item.description}
                      </Box>
                    }
                  />
                </Box>
              ))}
              <Box width="100%" display="flex" justifyContent="center" pb={1.5}>
                <Button href={faqPath}>More Questions</Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box >
    </ThemeProvider >
  );
};

export default FurnishedApartments;
