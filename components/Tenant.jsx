import React, { useState } from 'react';
import { ThemeProvider } from '../contexts/theme';
import { Box, Container, HtmlTranslation, SvgIcon, Typography } from '../UI/elements';
import { t } from '../../js/common/translations';
import { useBreakpoint } from '../hooks/useBreakpoint';

import {
  FixedTopDiamond,
  DiamondHeroImageFour,
  FixedUnderDiamond,
  DiamondHeroImageThree,
  DiamondHeroImageTwo,
  DiamondHeroImageOne,
  FixedBottomDiamond
} from '../UI/modules/tenant/diamonds';
import { StepOne, StepTwo, StepThree, StepFour } from '../UI/modules/tenant/timeline';
import HowToRentAparment from '../UI/modules/tenant/howToRentApartment';
import { ReasonOne, ReasonTwo, ReasonThree } from '../UI/modules/tenant/chooseTabas/reasons';
import RentAparmentWithConfidence from '../UI/modules/tenant/rentApartmentWithConfidence';

import {
  TenantContainer,
  HeroSection,
  HeroTextWrapper,
  HeroDescription,
  HeroButtonWrapper,
  HeroButton,
  HeroImagesWrapper,
  HeroDiamondImagesWrapper,
  HeroDiamondImagesContainer,
  HeroTitle,
  TitleWrapper,
  Title,
  Description,
  BannerSection,
  BannerContainer,
  BannerWrapper,
  BannerLeftSide,
  BannerTextWrapper,
  BannerTitle,
  BannerDescription,
  ButtonWrapper,
  BannerButton,
  WhyChooseTabasSection,
  ChooseTabasContainer,
  ColoredBackgroundSession,
  ColoredBrackgroundContainer,
  ColoredBackgroundWrapper,
  ColoredBackgroundBullet,
  TitleColoredBackground,
  ExternalAppLinkContainer,
  ExternaApplLink,
  ColoredBrackgroundMobileContainer
} from './Tenant.styles';

import TimelinePath from '../../../javascript/images/tenant/timeline/timeline_path.svg';
import TimelineMobilePath from '../../../javascript/images/tenant/timeline/timeline_mobile_path.svg';
import BannerOne from '../../../javascript/images/tenant/banner_1.png';
import BannerTwo from '../../../javascript/images/tenant/banner_2.png';
import ColoredBackground from '../../../javascript/images/tenant/colored_background.svg';
import PhoneMockup from '../../../javascript/images/tenant/phone_mockup.png';
import { PropertyTabs } from '../UI/modules';

const Tenant = ({ highlightedPropertiesByCity = [] }) => {
  const currentBreakpoint = useBreakpoint();
  const isMobile = ['xs'].includes(currentBreakpoint);
  const isTablet = ['sm'].includes(currentBreakpoint);
  const [currentCityTab, setCurrentCityTab] = useState(0);

  return (
    <ThemeProvider>
      <TenantContainer>
        <HeroSection>
          <Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 56px)' }}>
            <FixedTopDiamond />
            <HeroTextWrapper>
              <HeroTitle>
                <HtmlTranslation text={t('tenant_page.hero.title_html')} />
              </HeroTitle>
              <HeroDescription>{t('tenant_page.hero.description')}</HeroDescription>
              <HeroButtonWrapper>
                <HeroButton
                  variant="contained"
                  size="large"
                  type="button"
                  data-bs-toggle='modal'
                  data-bs-target='#modalCity'>
                  {t('tenant_page.buttons.rent_now')}
                </HeroButton>
                <HeroButton href="#timeline" variant="text" size="large">
                  {t('tenant_page.buttons.learn_more')}
                </HeroButton>
              </HeroButtonWrapper>
            </HeroTextWrapper>
            <Box sx={{ height: '100%', overflow: 'hidden' }}>
              <HeroImagesWrapper>
                <FixedUnderDiamond />
                <DiamondHeroImageFour />
                <HeroDiamondImagesWrapper>
                  <HeroDiamondImagesContainer>
                    <DiamondHeroImageThree />
                    <DiamondHeroImageTwo />
                  </HeroDiamondImagesContainer>
                  <DiamondHeroImageOne />
                  <FixedBottomDiamond />
                </HeroDiamondImagesWrapper>
              </HeroImagesWrapper>
            </Box>
          </Box>
        </HeroSection>
        <Box id="timeline" sx={{ backgroundColor: 'secondary.light', marginTop: { xs: '7rem' }, width: '100vw' }}>
          <Container sx={{ paddingX: { xs: '1rem' } }}>
            <TitleWrapper sx={{ marginTop: { md: '11rem' } }}>
              <Title>
                <HtmlTranslation text={t('tenant_page.timeline.title_html')} />
              </Title>
              <Description>{t('tenant_page.timeline.description')}</Description>
            </TitleWrapper>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                marginTop: '4.5rem',
                gap: `${!isMobile ? '8rem' : '1rem'}`,
                position: 'relative',
                justifyContent: 'space-between'
              }}
            >
              {!isMobile && (
                <Box
                  component="img"
                  src={!isTablet ? TimelinePath : TimelineMobilePath}
                  height="calc(100% - 5%)"
                  position="absolute"
                  top="4%"
                  left={!isTablet ? '40%' : '32%'}
                  sx={{
                    transform: { sm: 'rotate(-3deg)', md: 'rotate(-4deg)' }
                  }}
                />
              )}
              <StepOne />
              <StepTwo />
              <StepThree />
              <StepFour />
            </Box>
          </Container>
        </Box>
        <Box sx={{ marginTop: { xs: '2rem', md: '4rem' } }}>
          <Container>
            <TitleWrapper>
              <Title>
                <HtmlTranslation text={t('tenant_page.rent_apartment.title_html')} />
              </Title>
              <Description>
                {t('tenant_page.rent_apartment.description')}
              </Description>
            </TitleWrapper>
            <Box sx={{
              width: '100%',
              height: '100%',
              marginTop: '4rem'
            }}
            >
              <HowToRentAparment />
            </Box>
          </Container>
        </Box>
        <BannerSection>
          <BannerContainer>
            <BannerWrapper>
              <BannerLeftSide>
                <BannerTextWrapper>
                  <BannerTitle>{t('tenant_page.banners.banner_one_title')}</BannerTitle>
                  <BannerDescription>
                    {t('tenant_page.banners.banner_one_description')}
                  </BannerDescription>
                </BannerTextWrapper>
                <ButtonWrapper>
                  <BannerButton
                    size="large"
                    variant="contained"
                    sx={{ backgroundColor: 'secondary.main', color: 'primary.main' }}
                    type="button"
                    data-bs-toggle='modal'
                    data-bs-target='#modalCity'
                  >
                    {t('tenant_page.buttons.rent_apartment')}
                  </BannerButton>
                  <BannerButton href="#why-choose-tabas" size="large" variant="contained">
                    {t('tenant_page.buttons.thinking')}
                  </BannerButton>
                </ButtonWrapper>
              </BannerLeftSide>
              {!isMobile && (
                <Box
                  component="picture"
                  maxWidth='none'
                  sx={{
                    height: { sm: '384px', md: 'initial' }
                  }}
                >
                  <Box
                    component="img"
                    maxWidth='none'
                    src={BannerOne}
                    sx={{
                      height: { sm: '384px', md: 'initial' }
                    }}
                  />
                </Box>
              )}
            </BannerWrapper>
          </BannerContainer>
        </BannerSection>
        <WhyChooseTabasSection id="why-choose-tabas">
          <TitleWrapper>
            <Title component="span">
              <HtmlTranslation text={t('tenant_page.choose_tabas.title_html')} />
            </Title>
            <Description>{t('tenant_page.choose_tabas.description')}</Description>
          </TitleWrapper>
          <ChooseTabasContainer>
            <ReasonOne />
            <ReasonTwo />
            <ReasonThree />
          </ChooseTabasContainer>
        </WhyChooseTabasSection>
        <ColoredBackgroundSession>
          <ColoredBrackgroundContainer>
            <ColoredBackgroundWrapper>
              <ColoredBackgroundBullet />
              <ColoredBackgroundBullet sx={{ left: '12px' }} />
              <TitleColoredBackground>{t('tenant_page.background_colored_title')}</TitleColoredBackground>
              <ExternalAppLinkContainer>
                <ExternaApplLink href='https://apps.apple.com/us/app/tabas/id1564991268' target="_blank" rel="noreferrer">
                  <SvgIcon name="apple_store_large" size='160' />
                </ExternaApplLink>
                <ExternaApplLink href='https://play.google.com/store/apps/details?id=com.tabas_native_app' target="_blank" rel="noreferrer">
                  <SvgIcon name="google_store_large" size='160' />
                </ExternaApplLink>
              </ExternalAppLinkContainer>
            </ColoredBackgroundWrapper>
            <Box
              component="img"
              src={PhoneMockup}
              height={{
                xs: 0, sm: '500px', md: '700px', xl: '800px'
              }}
              sx={{
                position: 'absolute',
                objectFit: 'contain',
                zIndex: 10,
                bottom: { sm: '-20%', xl: '0' },
                left: { sm: '-16px', md: '10%' }
              }}
            />
            <Box
              component="img"
              src={ColoredBackground}
              width="100vw"
              height="100%"
              sx={{ objectFit: 'contain' }}
            />
          </ColoredBrackgroundContainer>
          <ColoredBrackgroundMobileContainer>
            <ColoredBackgroundWrapper>
              <ColoredBackgroundBullet />
              <ColoredBackgroundBullet sx={{ left: '4px' }} />
              <TitleColoredBackground>{t('tenant_page.background_colored_title')}</TitleColoredBackground>
              <ExternalAppLinkContainer>
                <ExternaApplLink href='https://apps.apple.com/us/app/tabas/id1564991268' target="_blank" rel="noreferrer">
                  <SvgIcon name="apple_store_large" size='160' />
                </ExternaApplLink>
                <ExternaApplLink href='https://play.google.com/store/apps/details?id=com.tabas_native_app' target="_blank" rel="noreferrer">
                  <SvgIcon name="google_store_large" size='160' />
                </ExternaApplLink>
              </ExternalAppLinkContainer>
            </ColoredBackgroundWrapper>
          </ColoredBrackgroundMobileContainer>
        </ColoredBackgroundSession>
        <Container sx={{ paddingX: { xs: '1rem' }, marginTop: { md: '2rem' } }}>
          <TitleWrapper>
            <Title>
              <HtmlTranslation text={t('tenant_page.rent_apartment_with_confidence.title_html')} />
            </Title>
            <Description>
              {t('tenant_page.rent_apartment_with_confidence.description')}
            </Description>
          </TitleWrapper>
          <RentAparmentWithConfidence />
        </Container>
        <BannerSection>
          <BannerContainer>
            <BannerWrapper>
              <BannerLeftSide>
                <BannerTextWrapper>
                  <BannerTitle>{t('tenant_page.banners.banner_two_title')}</BannerTitle>
                  <BannerDescription
                    sx={{
                      textAlign: { sm: 'left !important' }
                    }}
                  >
                    {t('tenant_page.banners.banner_two_description')}
                  </BannerDescription>
                </BannerTextWrapper>
                <ButtonWrapper>
                  <BannerButton
                    size="large"
                    variant="contained"
                    sx={{
                      backgroundColor: 'secondary.main', color: 'primary.main'
                    }}
                    type="button"
                    data-bs-toggle='modal'
                    data-bs-target='#modalCity'
                  >
                    {t('tenant_page.buttons.rent_apartment')}
                  </BannerButton>
                </ButtonWrapper>
              </BannerLeftSide>
              {!isMobile && (
                <Box
                  component="picture"
                  maxWidth='none'
                  sx={{
                    height: { sm: '384px', md: 'initial' }
                  }}
                >
                  <Box
                    component="img"
                    maxWidth='none'
                    src={BannerTwo}
                    sx={{
                      height: { sm: '384px', md: 'initial' }
                    }}
                  />
                </Box>
              )}
            </BannerWrapper>
          </BannerContainer>
        </BannerSection>
        <Box component="section" className="property-cards" mb={2}>
          <Container sx={{ px: [1, 1, 2] }} maxWidth="xl">
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h1"
                component="h2"
                mt={1}
                mb={1.5}
                sx={{ fontFamily: 'Cambon' }}
              >
                {t('home_page.highlights.title')}
              </Typography>
              <Typography
                variant="h5"
                component="p"
                sx={{
                  fontWeight: 'normal',
                  color: 'primary.light',
                  mb: 2
                }}
              >
                {t('home_page.highlights.description')}
              </Typography>
            </Box>
            <PropertyTabs
              tabs={highlightedPropertiesByCity.map(city => ({ ...city, label: city.name }))}
              activeTab={currentCityTab}
              onTabActiveChange={(tabIndex) => setCurrentCityTab(tabIndex)}
            />
          </Container>
        </Box>
      </TenantContainer>
    </ThemeProvider>
  );
};

export default Tenant;
