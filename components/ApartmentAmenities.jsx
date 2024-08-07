import React from 'react';
import { t } from '../../../js/common/translations';

import {
  Grid,
  Tooltip,
  IconButton,
  SvgIcon,
  Box,
  Typography
} from '../../UI/elements';

const ApartmentAmenities = ({ propertyAmenities }) => {
  const amenities = [
    {
      presence: propertyAmenities?.withWifi,
      title: t('amenities.wi_fi'),
      iconName: 'property_wifi'
    },
    {
      presence: propertyAmenities?.withBathProducts,
      title: t('amenities.bath_products'),
      iconName: 'property_bath_products'
    },
    {
      presence: propertyAmenities?.withMicrowaveOven,
      title: t('amenities.microwave_oven'),
      iconName: 'property_microwave'
    },
    {
      presence: propertyAmenities?.withMicrowave,
      title: t('amenities.microwave'),
      iconName: 'property_microwave'
    },
    {
      presence: propertyAmenities?.withSmartTv,
      title: t('amenities.smart_tv'),
      iconName: 'property_smart_tv'
    },
    {
      presence: propertyAmenities?.withLinenTowels,
      title: t('amenities.linen_towels'),
      iconName: 'property_linen_towels'
    },
    {
      presence: propertyAmenities?.withAirConditioning,
      title: t('amenities.air'),
      iconName: 'property_ac_unit'
    },
    {
      presence: propertyAmenities?.withPortableAc,
      title: t('amenities.portable_ac'),
      iconName: 'property_ac_unit'
    },
    {
      presence: propertyAmenities?.withCleaningServices,
      title: t('amenities.cleaning_service'),
      iconName: 'property_brush',
      tooltip: t('amenities.cleaning_service_tooltip')
    },
    {
      presence: propertyAmenities?.withCookingItems,
      title: t('amenities.equipped_for_cooking'),
      iconName: 'property_cutlery'
    },
    {
      presence: propertyAmenities?.withBalcony,
      title: t('amenities.balcony'),
      iconName: 'property_balcony'
    },
    {
      presence: propertyAmenities?.withWashingMachine,
      title: t('amenities.washing_machine'),
      iconName: 'property_washing_machine'
    },
    {
      presence: propertyAmenities?.withWashingMachineNoDryer,
      title: t('amenities.washing_machine_nodryer'),
      iconName: 'property_washing_machine'
    },
    {
      presence: propertyAmenities?.withCoffingMachine,
      title: t('amenities.coffee_machine'),
      iconName: 'property_coffee_machine'
    },
    {
      presence: propertyAmenities?.withSeaView,
      title: t('amenities.sea_view'),
      iconName: 'sea_view'
    },
    {
      presence: propertyAmenities?.withPrivatePoll,
      title: t('amenities.private_pool'),
      iconName: 'private_pool'
    },
    {
      presence: propertyAmenities?.withCeilingFan,
      title: t('amenities.ceiling_fan'),
      iconName: 'ceiling_fan'
    },
    {
      presence: propertyAmenities?.withOven,
      title: t('amenities.oven'),
      iconName: 'property_microwave'
    },
    {
      presence: propertyAmenities?.withStove,
      title: t('amenities.stove'),
      iconName: 'property_microwave'
    },
    {
      presence: propertyAmenities?.withAccessibleBathroom,
      title: t('amenities.accessible_bathroom'),
      iconName: 'wheelchair'
    }
  ];

  return (
    <Grid container>
      {amenities.map(({ presence, title, iconName, tooltip }, index) => (
        presence && (
          <Grid
            alignItems="center"
            display="flex"
            key={index}
            gap={1}
            xs={12}
            sm={6}
            md={4}
            p={1}
            item
          >
            <SvgIcon name={iconName} size="20" alt={`${t('apartment_page.alt')} ${title}`} />
            <Box>
              <Typography component="span" variant="lead" color="primary.80">{title}</Typography>
              {tooltip && (
                <Tooltip title={tooltip} placement="top">
                  <IconButton>
                    <SvgIcon name="question_circle" alt={t('amenities.tooltip_alt')} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Grid>
        )
      ))}
    </Grid>
  );
};

export default ApartmentAmenities;
