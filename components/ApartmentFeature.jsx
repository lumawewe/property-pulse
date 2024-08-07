import React, { useEffect, useState, useRef } from 'react';
import { t } from '../../../js/common/translations';
import { ThemeProvider } from '../../contexts/theme';
import { useBreakpoint } from '../../hooks/useBreakpoint';

import {
  Box,
  Container,
  Chip,
  Grid,
  Link,
  Typography,
  SvgIcon,
  Paper,
  Button
} from '../../UI/elements';

import { format, DATEPICKER_FORMAT } from '../../../js/common/dates';

import {
  ChipText,
  HeroInfoWrapper,
  HeroContainer,
  HeroImg,
  HeroButton,
  ApartmentAccordion,
  StandardsImg,
  ChooseDatesButton,
  AccordionSummaryTypography,
  ComingSoonWrapper,
  ComingSoonContainer,
  ComingSoonTitle,
  ComingSoonDescription,
  ComingSoonBottom,
  BreadcrumbsWrapper,
  BreadcrumbsTypography,
  BreadcrumbsLink,
  BreadcrumbsLi,
  FixedIconButton,
  BestDealContainer,
  BestDealTitle,
  BestDealContent,
  BestDealPrice,
  DividerWithText
} from './styles';

import LightingFastWifi from '../../../images/apartment_page/lighting_fast_wifi.jpg';
import LuxuriousBed from '../../../images/apartment_page/luxurious_bed.jpg';
import PremiumLineTowels from '../../../images/apartment_page/premium_line_towels.jpg';
import FullyFurnished from '../../../images/apartment_page/fully_furnished.jpg';
import { ContactUsDialog, GoogleMap, GoogleMapMarker, PropertyCardSlider, ApartmentDescription } from '../../UI/modules';
import mapMarkerTabas from '../../../../javascript/images/react_icons/map_marker_tabas.svg';
import { useToggle } from '../../hooks/useToggle';
import ApartmentGallerySlider from '../../UI/modules/ApartmentGallerySlider';
import ApartmentAmenities from './ApartmentAmenities';
import ApartmentFeatures from './ApartmentFeatures';

const ApartmentDetails = ({
  heroImg,
  propertyTitle,
  propertySubTitle,
  baseUrl,
  cityUrl,
  neighbourhoodUrl,
  propertyBuildingName,
  homeType,
  adminUser,
  propertyInternalId,
  propertyId,
  translationVariant,
  listingAdminPath,
  nextAvailableDay,
  nextAvailableDateValue,
  propertyNeighbourhood,
  bedroomCount,
  bathCount,
  parkingCount,
  parkingSize,
  gallery3dPresence,
  apartmentSummary,
  roomArrangement,
  cityName,
  propertyAmenities,
  propertyFeatures,
  propertyCoordinates,
  propertyAddressPresence,
  propertyAddress,
  propertiesNearby = [],
  apartmentsPath,
  photosGallery,
  tour3dSrc,
  propertyPrices,
  comingSoonProperty,
  checkIn,
  checkOut,
  apartmentWithAdjective,
  whatsappRedirectPath,
  minPriceDates,
  minPriceLabel,
  price,
  minPrice,
  availableOnRequest
}) => {
  const mobile = ['xs', 'sm'].includes(useBreakpoint());
  const [propertyMapLatLng, setPropertyMapLatLng] = useState({ lat: 0, lng: 0 });
  const [openSwiper, setOpenSwiper] = useToggle();
  const [open3dTourDialog, setOpen3dTourDialog] = useToggle();
  const [openContactDialog, setOpenContactDialog] = useToggle();
  const [controlAccordionExpansion, setControlAccordionExpansion] = useState(false);
  const accordionRef = useRef([]);

  const openSwiperFullscreen = () => {
    const body = document.body;
    body.style.overflow = openSwiper ? 'auto' : 'hidden';
    setOpenSwiper();
  };

  const handleAccordionExpansion = (accordion, index) => (isExpanded) => {
    setControlAccordionExpansion(isExpanded && !(accordion === controlAccordionExpansion) ? accordion : false);
    accordionRef.current[index].scrollIntoView({ block: 'center' });
  };

  useEffect(() => {
    if (propertyCoordinates?.longitudePresent && propertyCoordinates?.latitudePresent) {
      setPropertyMapLatLng({
        lat: parseFloat(propertyCoordinates.latitudeValue),
        lng: parseFloat(propertyCoordinates.longitudeValue)
      });
    }
  }, [propertyCoordinates]);

  const whatsappRedirectPathHref = `${whatsappRedirectPath}?button_type=${t('campaign_tracker.button_type.sales')}${checkIn ? `&start_date=${format(checkIn, DATEPICKER_FORMAT)}` : ''}${checkOut ? `&end_date=${format(checkOut, DATEPICKER_FORMAT)}` : ''}`;

  const tabasStandards = [
    {
      image: LightingFastWifi,
      title: t('apartment_page.experience.lighting_fast_wifi.label'),
      alt: t('apartment_alt.amenities.wifi')
    },
    {
      image: LuxuriousBed,
      title: t('apartment_page.experience.luxurious_bed.label'),
      alt: t('apartment_alt.amenities.beds')
    },
    {
      image: PremiumLineTowels,
      title: t('apartment_page.experience.premium_line_towels.label'),
      alt: t('apartment_alt.amenities.sheets')
    },
    {
      image: FullyFurnished,
      title: t('apartment_page.experience.fully_furnished.label'),
      alt: t('apartment_alt.amenities.fully_furnished')
    }
  ];

  const accordionItems = [
    {
      showContent: true,
      defaultExpanded: true,
      sectionClassName: 'descriptions',
      summaryContent: t('apartment_page.description.title'),
      detailsContent: (
        <ApartmentDescription
          bedroomCount={bedroomCount}
          bathCount={bathCount}
          apartmentSummary={apartmentSummary}
          parkingCount={parkingCount}
          parkingSize={parkingSize}
          isPetFriendly={propertyFeatures?.isPetFriendly}
          translationVariant={translationVariant}
        />
      )
    },
    {
      showContent: true,
      defaultExpanded: false,
      summaryContent: t('apartment_page.sleeping.title'),
      sectionClassName: 'descriptions',
      detailsContent:
        <Grid container justifyContent="space-between">
          {roomArrangement.map(({ room_title: bedroomNumber, room_text: bedName }, index) => (
            <Grid item p={0.5} xs={12} md={6} display="flex" key={index}>
              <SvgIcon name="property_bed_dark" sx={{ p: 1 }} alt={`${t('apartment_page.alt')} ${bedName}`} />
              <Box display="flex" flexDirection="column" justifyContent="space-evenly">
                <Typography color="primary.80" fontWeight={600} variant="lead">{bedName}</Typography>
                <Typography color="primary.80" fontSize="0.75rem">{bedroomNumber}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>,
      collapsedSize: mobile ? 140 : 0
    },
    {
      showContent: propertyAmenities?.amenitiesPresence,
      defaultExpanded: false,
      summaryContent: t('amenities.title'),
      sectionClassName: 'features',
      detailsContent:
        <ApartmentAmenities propertyAmenities={propertyAmenities} />,
      collapsedSize: mobile ? 120 : 0
    },
    {
      showContent: propertyFeatures?.featuresPresence,
      defaultExpanded: false,
      summaryContent: t('apartment_page.features.title'),
      sectionClassName: 'features',
      detailsContent:
        <ApartmentFeatures propertyFeatures={propertyFeatures} propertyAmenities={propertyAmenities} />,
      collapsedSize: mobile ? 120 : 0
    },
    {
      showContent: true,
      defaultExpanded: false,
      summaryContent: t('apartment_page.experience.title'),
      sectionClassName: 'features',
      detailsContent:
        <Grid container spacing={1}>
          {tabasStandards.map(({ image, title, alt }, index) => (
            <Grid key={index} item xs={6} md={4}>
              <Paper
                sx={{
                  flexDirection: 'column',
                  textAlign: 'center',
                  display: 'flex',
                  border: 1,
                  borderColor: '#F2F2F2',
                  height: 1,
                  p: 1
                }}
                elevation={0}
              >
                <StandardsImg borderRadius={1} component="picture">
                  <StandardsImg
                    alt={alt}
                    borderRadius={1}
                    component="img"
                    src={image}
                  />
                </StandardsImg>
                <Typography
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    minHeight: 52
                  }}
                  component="span"
                  color="primary"
                  variant="h6"
                  mt={1}
                >
                  {title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>,
      collapsedSize: mobile ? 260 : 0
    }
  ];

  useEffect(() => {
    accordionRef.current = accordionRef.current.slice(0, accordionItems.length);
  }, [accordionItems]);

  return (
    <ThemeProvider>
      <HeroContainer>
        <HeroImg component="div" onClick={() => openSwiperFullscreen()}>
          <HeroImg component="img" src={heroImg} alt={t('apartment_alt.hero', { city: cityName, neighbourhood: propertyNeighbourhood, internal_id: propertyInternalId })} />
          {comingSoonProperty && (
            <ComingSoonContainer>
              <ComingSoonTitle>
                {t('coming_soon_msg.title')}
              </ComingSoonTitle>
              <ComingSoonDescription opacity='0.8'>
                {t('coming_soon_msg.description')}
              </ComingSoonDescription>
              <ComingSoonBottom>
                {t('coming_soon_msg.bottom')}
              </ComingSoonBottom>
            </ComingSoonContainer>
          )}
        </HeroImg>
        <BreadcrumbsWrapper
          component="ol"
          display="flex"
          alignItems="center"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <BreadcrumbsLi
            itemProp='itemListElement'
            itemScope
            itemType='https://schema.org/ListItem'
          >
            <BreadcrumbsLink
              itemProp='item'
              href={baseUrl + 'apartments/' + cityUrl} >
              <BreadcrumbsTypography itemProp="name" name={cityName}>
                {cityName}
              </BreadcrumbsTypography>
              <Box
                component="meta"
                itemProp="position"
                content="1" />
            </BreadcrumbsLink>
            <BreadcrumbsTypography sx={{ mx: 0.5 }}>
              {'>'}
            </BreadcrumbsTypography>
          </BreadcrumbsLi>
          <BreadcrumbsLi
            itemProp='itemListElement'
            itemScope
            itemType='https://schema.org/ListItem'>
            <BreadcrumbsLink
              itemProp='item'
              href={baseUrl + 'apartments/' + cityUrl + '?search[neighbourhoods][]=' + neighbourhoodUrl} >
              <BreadcrumbsTypography
                component="span"
                itemProp="name"
                name={propertyNeighbourhood}
              >
                {propertyNeighbourhood}
              </BreadcrumbsTypography>
              <Box
                component="meta"
                itemProp="position"
                content="2" />
            </BreadcrumbsLink>
            <BreadcrumbsTypography sx={{ mx: 0.5 }}>
              {'>'}
            </BreadcrumbsTypography>
          </BreadcrumbsLi>
          <BreadcrumbsLi
            itemProp='itemListElement'
            itemScope
            itemType='https://schema.org/ListItem'
          >
            <BreadcrumbsTypography
              component="span"
              itemProp="name"
              name={propertyTitle}
            >
              {propertyTitle}
            </BreadcrumbsTypography>
            <Box
              component="meta"
              itemProp="position"
              content="3" />
          </BreadcrumbsLi>
        </BreadcrumbsWrapper>
        <HeroInfoWrapper>
          <Container disableGutters maxWidth="lg">
            <Grid item md={8} sx={{ display: 'flex', flexDirection: 'column', maxWidth: 'lg', gap: 0.5 }}>
              <Box display="flex" gap={0.5}>
                <Chip
                  sx={{ width: 'fit-content', pointerEvents: 'auto' }}
                  size="small"
                  color="secondary"
                  label={adminUser ? (
                    <Link href={listingAdminPath} target="_blank">
                      {`${t('bottom_sticky_menu.update')} ${propertyInternalId}`}
                    </Link>)
                    : (<ChipText>
                      {propertyInternalId}
                    </ChipText>)
                  }
                />
                { (mobile && !availableOnRequest) &&
                  <Chip
                    size="small"
                    sx={{ bgcolor: 'primary.10', width: 'fit-content' }}
                    label={
                      <ChipText display="flex">
                        {t('apartment_page.reservation_form.available_from')}
                        {nextAvailableDay &&
                          <ChipText component="span" sx={{ fontWeight: '500', ml: 0.25 }}>
                            {` ${nextAvailableDateValue}`}
                          </ChipText>
                        }
                      </ChipText>
                    }
                  />
                }
              </Box>
              <Typography
                variant="h5"
                color="secondary"
                component="span"
                sx={{ opacity: 0.8 }}
              >
                {propertyBuildingName && `${propertyBuildingName} - `}
                {propertyNeighbourhood}
              </Typography>
              <Typography variant="h4" component="h1" color="secondary">
                {`${apartmentWithAdjective} ${propertyTitle}`}
              </Typography>
              <Box
                flexDirection={{ xs: 'column', lg: 'row' }}
                justifyContent="space-between"
                display="flex"
                gap={0.5}
              >
                <Box component="span">
                  <Box display="flex" gap={{ xs: 0.5, lg: 1 }}>
                    {homeType === 'Duplex' && (
                      <Box component="span" display="flex">
                        <SvgIcon name="duplex_build" size={mobile ? 13 : 20} />
                        <Typography variant="lead" ml={0.25} color="secondary">
                          {homeType}
                        </Typography>
                      </Box>
                    )}
                    <Box component="span" display="flex">
                      <SvgIcon name="property_bed" size={mobile ? 13 : 20} />
                      <Typography variant="lead" ml={0.25} color="secondary">
                        {t(`apartment_page.summary.quick-info.bed.${bedroomCount > 1 ? 'other' : 'one'}`)}
                      </Typography>
                    </Box>
                    <Box component="span" display="flex">
                      <SvgIcon name="property_bath" size={mobile ? 13 : 20} />
                      <Typography variant="lead" ml={0.25} color="secondary">
                        {t(`apartment_page.summary.quick-info.bath.${bathCount > 1 ? 'other' : 'one'}`)}
                      </Typography>
                    </Box>
                    <Box component="span" display="flex">
                      <SvgIcon name="property_house" size={mobile ? 13 : 20} />
                      <Typography variant="lead" ml={0.25} color="secondary">
                        {t('apartment_page.summary.quick-info.sqm_html')}
                      </Typography>
                    </Box>
                    {parkingCount && (
                      <Box component="span" display="flex">
                        <SvgIcon name="property_parking" size={mobile ? 13 : 20} />
                        <Typography variant="lead" ml={0.25} color="secondary">
                          {t(`apartment_page.summary.quick-info.parking_slot.${parkingCount > 1 ? 'other' : 'one'}`)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box display="flex" gap={0.5}>
                  {gallery3dPresence && (
                    <HeroButton id="btn-3d-tour" startIcon={{ name: 'property_3dtour' }} onClick={setOpen3dTourDialog}>
                      <Typography fontSize="0.75rem" component="span">
                        {t('apartment_page.summary.quick-links.3dtour')}
                      </Typography>
                    </HeroButton>
                  )}
                  <HeroButton startIcon={{ name: 'property_gallery' }} onClick={() => openSwiperFullscreen()}>
                    <Typography fontSize="0.75rem" component="span">
                      {t('apartment_page.summary.quick-links.gallery')}
                    </Typography>
                  </HeroButton>
                  <HeroButton startIcon={{ name: 'property_map' }} href="#map-section">
                    <Typography fontSize="0.75rem" component="span">
                      {t('apartment_page.summary.quick-links.map_position')}
                    </Typography>
                  </HeroButton>
                </Box>
              </Box>
            </Grid>
            {(mobile && (!!checkIn && !!checkOut) && (
              <>
                {(!!minPriceDates && !!minPrice) ? <Box pb={7} /> : <Box pb={5} />}
              </>
            ))}
          </Container>
        </HeroInfoWrapper>
      </HeroContainer>
      <Container
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'lg',
          bgcolor: 'secondary.light'
        }}
      >
        <Grid container spacing={1}>
          <Grid item md={8}>
            {accordionItems.filter(item => item.showContent)
              .map(({ sectionClassName, defaultExpanded, summaryContent, detailsContent, collapsedSize }, index) => {
                const accordionId = summaryContent.replace(/\s/g, '-');

                return (
                  <Container key={index} disableGutters component="section" className={sectionClassName} ref={el => (accordionRef.current[index] = el)}>
                    <ApartmentAccordion
                      summaryAriaControls={`${accordionId}-content`}
                      summaryId={`${accordionId}-header`}
                      expanded={controlAccordionExpansion === accordionId || !mobile || defaultExpanded}
                      onChange={handleAccordionExpansion(accordionId, index)}
                      $mobile={mobile}
                      TransitionProps={{
                        collapsedSize: collapsedSize
                      }}
                      accordionSummaryContent={
                        <AccordionSummaryTypography>
                          {summaryContent}
                        </AccordionSummaryTypography>
                      }
                      accordionDetailsContent={
                        <Box component="span">
                          {detailsContent}
                        </Box>
                      }
                    />
                  </Container>
                );
              })}
            {(propertyCoordinates?.longitudePresent && propertyCoordinates?.latitudePresent) && (
              <Container
                sx={{ px: 1, pt: 1, pb: 2 }}
                disableGutters
                id="map-section"
                component="section"
                className="map"
              >
                <Typography
                  fontFamily="Cambon"
                  fontWeight={800}
                  color="primary"
                  component="h3"
                  variant="h5"
                  gutterBottom
                >
                  {t('apartment_page.location.title')}
                </Typography>
                {propertyAddressPresence && (
                  <Typography variant="lead" fontWeight={500} color="primary.80">{propertyAddress}</Typography>
                )}
                <Paper elevation={0} sx={{ p: 1, border: 1, borderColor: '#F2F2F2' }}>
                  <GoogleMap zoom={14} center={propertyMapLatLng} mapWrapperProps={{ height: 500 }}>
                    <GoogleMapMarker position={propertyMapLatLng} icon={mapMarkerTabas} />
                  </GoogleMap>
                </Paper>
              </Container>
            )}
          </Grid>
          <Grid item md={4} display="flex-inline" alignItems="flex-start">
            <Paper
              className="order-details"
              component="aside"
              sx={{
                width: 1,
                zIndex: 'speedDial',
                justifyContent: 'center',
                flexDirection: 'column',
                position: mobile ? 'fixed' : 'sticky',
                display: 'flex',
                top: !mobile && 80,
                bottom: mobile && 0,
                mt: { xs: -16, sm: -10 },
                mb: { xs: 0, md: 2 },
                gap: 0.5,
                p: 1
              }}
            >
              <Box>
                {!(checkIn && checkOut) && propertyPrices?.promotionalPricePresent && (
                  <Typography color="primary" component="span" variant="lead" sx={{ textDecoration: 'line-through' }}>
                    {t('apartment_page.reservation_form.price') + t('apartment_page.reservation_form.per_month')}
                  </Typography>
                )}
                {!(checkIn && checkOut) && (<Box display="flex" flexDirection="row" justifyContent="space-between">
                  <Typography variant="h6" color="primary" component="span">
                    {(propertyPrices?.initialPricePresent && !propertyPrices?.pricePrecise && cityName === 'Rio de Janeiro'
                      ? propertyPrices?.formattedInitialPrice : propertyPrices?.formattedPrice) + t('apartment_page.reservation_form.per_month')}
                  </Typography>
                </Box>)}
                <Box>
                  {propertySubTitle && (
                    <Typography fontWeight={300} color="primary" variant="h6">{`${propertySubTitle}`}</Typography>
                  )}
                </Box>
                <Box display="flex">
                  <Typography
                    component="span"
                    fontWeight={300}
                    color="primary"
                    variant="h6"
                    mr={0.25}
                    mb={ availableOnRequest && !mobile ? 3 : 0 }
                  >
                    { availableOnRequest ? t('property_card.available_on_request_badge') : t('apartment_page.reservation_form.available_from') }
                  </Typography>
                  {nextAvailableDay && !availableOnRequest && (
                    <Typography variant="h6" color="primary" component="span" data-nosnippet="true">
                      {nextAvailableDateValue}
                    </Typography>
                  )}
                </Box>
              </Box>
              { !availableOnRequest &&
              (
                <Box
                  className="select-bestdeal-dates"
                  sx={{
                    ...((minPriceDates && minPrice) ? { display: 'block' } : { display: 'none' }),
                    cursor: 'pointer'
                  }}
                >
                  <BestDealContainer>
                    <SvgIcon name="best_deal" />
                    <Box>
                      <BestDealTitle>
                        {minPrice >= price ? t('property_card.suggestion') : t('property_card.best_deal')}
                      </BestDealTitle>
                      <BestDealContent>
                        {minPriceDates}
                      </BestDealContent>
                    </Box>
                    <BestDealPrice>
                      {minPriceLabel.price}
                      <Typography variant="caption" fontSize="0.625rem">
                        {minPriceLabel.suffix}
                      </Typography>
                    </BestDealPrice>
                  </BestDealContainer>
                </Box>
              )}
              {(!!checkIn && !!checkOut) ? (
                <Box
                  display="flex"
                  sx={{ cursor: 'pointer' }}
                  className="select-dates availability-bt-choose-date"
                  borderColor="primary.30"
                  borderRadius={2}
                  border={1}
                  p={1}
                  justifyContent="space-between"
                >
                  <Box>
                    {checkIn && format(checkIn, DATEPICKER_FORMAT)}
                    <SvgIcon name="arrow_dates_right_black" size="12" style={{ margin: '0 8px' }} />
                    {checkOut && format(checkOut, DATEPICKER_FORMAT)}
                  </Box>
                  <Typography fontSize="0.875rem" fontWeight="600">
                    {(propertyPrices?.priceForLessThan30DaysPresent)
                      ? propertyPrices?.formattedPriceForLessThan30Days
                      : (propertyPrices?.initialPricePresent && !propertyPrices?.pricePrecise
                        ? propertyPrices?.formattedInitialPrice : propertyPrices?.formattedPrice)}
                    { !propertyPrices?.priceForLessThan30DaysPresent && (
                      <Typography variant="caption" fontSize="0.625rem">
                        {t('property_card.by_month')}
                      </Typography>
                    )}
                  </Typography>
                </Box>
              ) : (
                <Box display="none" className="select-dates availability-bt-choose-date" />
              )}
              {(checkIn && checkOut) ? (
                <ChooseDatesButton
                  $mobile={mobile}
                  id="reservation-mobile-sticky__request-submit"
                  className="reservation-sticky-request-submit"
                  type="submit"
                  pill={false}
                  size="large"
                >
                  {t('apartment_page.reservation_form.submit')}
                </ChooseDatesButton>
              ) : (
                <Box display="none" className="reservation-sticky-request-submit" />
              )}
              <Box display="none" className="reservation-sticky-request-submit-trigger">{'false'}</Box>
              {(!mobile && !availableOnRequest && ((checkIn && checkOut) || (minPriceDates && minPrice))) && (
                <DividerWithText>
                  {t('login_page.or')}
                </DividerWithText>
              )}
              <Box gap={0.5} display="flex" justifyContent="space-between" flexDirection={{ xs: 'row-reverse', md: 'column' }}>
                { !availableOnRequest &&
                  (
                    <ChooseDatesButton
                      $mobile={mobile}
                      id="reservation-mobile-sticky__submit"
                      className="reservation-sticky-submit availability-bt-check"
                      type="submit"
                      size="large"
                    >
                      {t('apartment_page.reservation_form.review_booking')}
                    </ChooseDatesButton>
                  )
                }
                <ChooseDatesButton
                  className="sticky-contact-us-clickable whatsapp-link whatsapp-link-content"
                  $mobile={mobile}
                  startIcon={{ name: 'whatsapp' }}
                  variant="outlined"
                  href={whatsappRedirectPathHref}
                  rel="nofollow"
                  target="_blank"
                  size="large"
                >
                  {t('apartment_page.reservation_form.whatsapp_us')}
                </ChooseDatesButton>
              </Box>
              {!mobile && (
                <Link textAlign="center" onClick={setOpenContactDialog} className="contact-us-bt-modal">
                  <Typography fontSize={'0.75rem'} variant="lead">
                    {t('apartment_page.reservation_form.or_contact_us')}
                  </Typography>
                </Link>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {propertiesNearby.length > 0 && (
        <Box
          className="related-properties"
          component="section"
          pt={1}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'secondary.main'
          }}
        >
          <Typography
            color="primary.70"
            gutterBottom
            fontWeight={600}
            variant="lead"
            component="span"
          >
            {t('apartment_page.related-properties.pre-title')}
          </Typography>
          <Box display="flex" textAlign="center">
            <Typography
              fontFamily="Cambon"
              fontWeight={800}
              sx={{ mr: 0.5 }}
              color="primary"
              component="h3"
              variant="h2"
            >
              {t('apartment_page.related-properties.title.first')}
              <Typography
                className="text-tabas-salmon"
                fontFamily="Cambon"
                component="span"
                sx={{ ml: 0.5 }}
                fontWeight={800}
                variant="h2"
              >
                {t('apartment_page.related-properties.title.second')}
              </Typography>
            </Typography>
          </Box>
          <Container disableGutters maxWidth="xl">
            <PropertyCardSlider
              properties={propertiesNearby}
            />
          </Container>
          <Button sx={{ mt: 1, mb: 2 }} size="large" href={apartmentsPath}>{t('apartment_page.related-properties.cta')}</Button>
        </Box>
      )}
      <Box component="section">
        {openSwiper && (
          <Box
            bgcolor="primary.main"
            zIndex="snackbar"
            position="fixed"
            height={1}
            width={1}
            top={0}
          >
            <FixedIconButton onClick={() => openSwiperFullscreen()}>
              <Typography pr={1} variant="lead" color="secondary.main">{t('apartment_page.photos.close')}</Typography>
              <SvgIcon name="close_icon" />
            </FixedIconButton>
            {comingSoonProperty && (
              <ComingSoonWrapper>
                <Typography variant='h3' lineHeight='2.625rem'>
                  {t('coming_soon_msg.title')}
                </Typography>
                <Typography
                  component='p'
                  variant='lead'
                  lineHeight='21px'
                  fontWeight='400'
                  sx={{ opacity: '0.8' }}
                >
                  {t('coming_soon_msg.description')}
                </Typography>
                <Typography component='p' variant='h5' lineHeight='1.875rem' fontWeight='500'>
                  {t('coming_soon_msg.bottom')}
                </Typography>
              </ComingSoonWrapper>
            )}
            <ApartmentGallerySlider
              slides={photosGallery.map(({
                img_alt: altImgText,
                url_for_photo_image_variant_r2f_1280x769: imgVariantR2f
              }, index) => (
                <Box component="figure" key={index}>
                  {altImgText && (
                    <Box
                      component="figcaption"
                      position="relative"
                      top={-20}
                    >
                      <Typography
                        color="secondary.main"
                        display="inline"
                        bgcolor="primary.40"
                        p={0.5}
                      >
                        {altImgText}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    maxHeight="80vh"
                    component="picture"
                  >
                    <Box
                      maxHeight="80vh"
                      component="img"
                      alt={t('apartment_alt.images', { figcaption: altImgText, city: cityName, neighbourhood: propertyNeighbourhood, internal_id: propertyInternalId })}
                      src={imgVariantR2f}
                    />
                  </Box>
                </Box>
              ))}
            />
          </Box>
        )}
        {(tour3dSrc && open3dTourDialog) && (
          <Box
            bgcolor="primary.main"
            zIndex="snackbar"
            position="fixed"
            height={1}
            width={1}
            top={0}
          >
            <FixedIconButton onClick={setOpen3dTourDialog}>
              <Typography pr={1} variant="lead" color="secondary.main">{t('apartment_page.3dtour.close')}</Typography>
              <SvgIcon name="close_icon" />
            </FixedIconButton>
            <Box component="iframe" height={1} width={1} src={tour3dSrc} allowFullScreen allow='vr'></Box>
          </Box>
        )}
        <ContactUsDialog
          className="contact-us-modal"
          open={openContactDialog}
          props={{ whatsappRedirectPathHref: whatsappRedirectPathHref }}
          onClose={() => setOpenContactDialog()}
        />
      </Box>
    </ThemeProvider>
  );
};

export default ApartmentDetails;
