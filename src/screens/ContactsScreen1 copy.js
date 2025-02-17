import React, { useContext, useState, useRef } from 'react';
import { colors } from '../config/theme';
import { ThemeContext } from '../context/ThemeContext';
import { View, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { AlphabetList } from 'react-native-section-alphabet-list';

const HomeScreens = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const styles = createStyles(activeColors);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    setRefreshing(false);
  };

  const sectionListRef = useRef(null);

  const handleScrollToSection = (letter) => {
    console.log('LETTER => ', letter);
    console.log('SECTIONLISTREF => ', sectionListRef);
    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        viewPosition: 0,
        animated: true,
      });
    }
  };

  const exampleData = [
    { value: 'Afghanistan', key: 'AF' },
    { value: 'Åland Islands', key: 'AX' },
    { value: 'Albania', key: 'AL' },
    { value: 'Algeria', key: 'DZ' },
    { value: 'American Samoa', key: 'AS' },
    { value: 'AndorrA', key: 'AD' },
    { value: 'Angola', key: 'AO' },
    { value: 'Anguilla', key: 'AI' },
    { value: 'Antarctica', key: 'AQ' },
    { value: 'Antigua and Barbuda', key: 'AG' },
    { value: 'Argentina', key: 'AR' },
    { value: 'Armenia', key: 'AM' },
    { value: 'Aruba', key: 'AW' },
    { value: 'Australia', key: 'AU' },
    { value: 'Austria', key: 'AT' },
    { value: 'Azerbaijan', key: 'AZ' },
    { value: 'Bahamas', key: 'BS' },
    { value: 'Bahrain', key: 'BH' },
    { value: 'Bangladesh', key: 'BD' },
    { value: 'Barbados', key: 'BB' },
    { value: 'Belarus', key: 'BY' },
    { value: 'Belgium', key: 'BE' },
    { value: 'Belize', key: 'BZ' },
    { value: 'Benin', key: 'BJ' },
    { value: 'Bermuda', key: 'BM' },
    { value: 'Bhutan', key: 'BT' },
    { value: 'Bolivia', key: 'BO' },
    { value: 'Bosnia and Herzegovina', key: 'BA' },
    { value: 'Botswana', key: 'BW' },
    { value: 'Bouvet Island', key: 'BV' },
    { value: 'Brazil', key: 'BR' },
    { value: 'British Indian Ocean Territory', key: 'IO' },
    { value: 'Brunei Darussalam', key: 'BN' },
    { value: 'Bulgaria', key: 'BG' },
    { value: 'Burkina Faso', key: 'BF' },
    { value: 'Burundi', key: 'BI' },
    { value: 'Cambodia', key: 'KH' },
    { value: 'Cameroon', key: 'CM' },
    { value: 'Canada', key: 'CA' },
    { value: 'Cape Verde', key: 'CV' },
    { value: 'Cayman Islands', key: 'KY' },
    { value: 'Central African Republic', key: 'CF' },
    { value: 'Chad', key: 'TD' },
    { value: 'Chile', key: 'CL' },
    { value: 'China', key: 'CN' },
    { value: 'Christmas Island', key: 'CX' },
    { value: 'Cocos (Keeling) Islands', key: 'CC' },
    { value: 'Colombia', key: 'CO' },
    { value: 'Comoros', key: 'KM' },
    { value: 'Congo', key: 'CG' },
    { value: 'Congo, The Democratic Republic of the', key: 'CD' },
    { value: 'Cook Islands', key: 'CK' },
    { value: 'Costa Rica', key: 'CR' },
    { value: "Cote D'Ivoire", key: 'CI' },
    { value: 'Croatia', key: 'HR' },
    { value: 'Cuba', key: 'CU' },
    { value: 'Cyprus', key: 'CY' },
    { value: 'Czech Republic', key: 'CZ' },
    { value: 'Denmark', key: 'DK' },
    { value: 'Djibouti', key: 'DJ' },
    { value: 'Dominica', key: 'DM' },
    { value: 'Dominican Republic', key: 'DO' },
    { value: 'Ecuador', key: 'EC' },
    { value: 'Egypt', key: 'EG' },
    { value: 'El Salvador', key: 'SV' },
    { value: 'Equatorial Guinea', key: 'GQ' },
    { value: 'Eritrea', key: 'ER' },
    { value: 'Estonia', key: 'EE' },
    { value: 'Ethiopia', key: 'ET' },
    { value: 'Falkland Islands (Malvinas)', key: 'FK' },
    { value: 'Faroe Islands', key: 'FO' },
    { value: 'Fiji', key: 'FJ' },
    { value: 'Finland', key: 'FI' },
    { value: 'France', key: 'FR' },
    { value: 'French Guiana', key: 'GF' },
    { value: 'French Polynesia', key: 'PF' },
    { value: 'French Southern Territories', key: 'TF' },
    { value: 'Gabon', key: 'GA' },
    { value: 'Gambia', key: 'GM' },
    { value: 'Georgia', key: 'GE' },
    { value: 'Germany', key: 'DE' },
    { value: 'Ghana', key: 'GH' },
    { value: 'Gibraltar', key: 'GI' },
    { value: 'Greece', key: 'GR' },
    { value: 'Greenland', key: 'GL' },
    { value: 'Grenada', key: 'GD' },
    { value: 'Guadeloupe', key: 'GP' },
    { value: 'Guam', key: 'GU' },
    { value: 'Guatemala', key: 'GT' },
    { value: 'Guernsey', key: 'GG' },
    { value: 'Guinea', key: 'GN' },
    { value: 'Guinea-Bissau', key: 'GW' },
    { value: 'Guyana', key: 'GY' },
    { value: 'Haiti', key: 'HT' },
    { value: 'Heard Island and Mcdonald Islands', key: 'HM' },
    { value: 'Holy See (Vatican City State)', key: 'VA' },
    { value: 'Honduras', key: 'HN' },
    { value: 'Hong Kong', key: 'HK' },
    { value: 'Hungary', key: 'HU' },
    { value: 'Iceland', key: 'IS' },
    { value: 'India', key: 'IN' },
    { value: 'Indonesia', key: 'ID' },
    { value: 'Iran, Islamic Republic Of', key: 'IR' },
    { value: 'Iraq', key: 'IQ' },
    { value: 'Ireland', key: 'IE' },
    { value: 'Isle of Man', key: 'IM' },
    { value: 'Israel', key: 'IL' },
    { value: 'Italy', key: 'IT' },
    { value: 'Jamaica', key: 'JM' },
    { value: 'Japan', key: 'JP' },
    { value: 'Jersey', key: 'JE' },
    { value: 'Jordan', key: 'JO' },
    { value: 'Kazakhstan', key: 'KZ' },
    { value: 'Kenya', key: 'KE' },
    { value: 'Kiribati', key: 'KI' },
    { value: "Korea, Democratic People'S Republic of", key: 'KP' },
    { value: 'Korea, Republic of', key: 'KR' },
    { value: 'Kuwait', key: 'KW' },
    { value: 'Kyrgyzstan', key: 'KG' },
    { value: "Lao People'S Democratic Republic", key: 'LA' },
    { value: 'Latvia', key: 'LV' },
    { value: 'Lebanon', key: 'LB' },
    { value: 'Lesotho', key: 'LS' },
    { value: 'Liberia', key: 'LR' },
    { value: 'Libyan Arab Jamahiriya', key: 'LY' },
    { value: 'Liechtenstein', key: 'LI' },
    { value: 'Lithuania', key: 'LT' },
    { value: 'Luxembourg', key: 'LU' },
    { value: 'Macao', key: 'MO' },
    { value: 'Macedonia, The Former Yugoslav Republic of', key: 'MK' },
    { value: 'Madagascar', key: 'MG' },
    { value: 'Malawi', key: 'MW' },
    { value: 'Malaysia', key: 'MY' },
    { value: 'Maldives', key: 'MV' },
    { value: 'Mali', key: 'ML' },
    { value: 'Malta', key: 'MT' },
    { value: 'Marshall Islands', key: 'MH' },
    { value: 'Martinique', key: 'MQ' },
    { value: 'Mauritania', key: 'MR' },
    { value: 'Mauritius', key: 'MU' },
    { value: 'Mayotte', key: 'YT' },
    { value: 'Mexico', key: 'MX' },
    { value: 'Micronesia, Federated States of', key: 'FM' },
    { value: 'Moldova, Republic of', key: 'MD' },
    { value: 'Monaco', key: 'MC' },
    { value: 'Mongolia', key: 'MN' },
    { value: 'Montserrat', key: 'MS' },
    { value: 'Morocco', key: 'MA' },
    { value: 'Mozambique', key: 'MZ' },
    { value: 'Myanmar', key: 'MM' },
    { value: 'Namibia', key: 'NA' },
    { value: 'Nauru', key: 'NR' },
    { value: 'Nepal', key: 'NP' },
    { value: 'Netherlands', key: 'NL' },
    { value: 'Netherlands Antilles', key: 'AN' },
    { value: 'New Caledonia', key: 'NC' },
    { value: 'New Zealand', key: 'NZ' },
    { value: 'Nicaragua', key: 'NI' },
    { value: 'Niger', key: 'NE' },
    { value: 'Nigeria', key: 'NG' },
    { value: 'Niue', key: 'NU' },
    { value: 'Norfolk Island', key: 'NF' },
    { value: 'Northern Mariana Islands', key: 'MP' },
    { value: 'Norway', key: 'NO' },
    { value: 'Oman', key: 'OM' },
    { value: 'Pakistan', key: 'PK' },
    { value: 'Palau', key: 'PW' },
    { value: 'Palestinian Territory, Occupied', key: 'PS' },
    { value: 'Panama', key: 'PA' },
    { value: 'Papua New Guinea', key: 'PG' },
    { value: 'Paraguay', key: 'PY' },
    { value: 'Peru', key: 'PE' },
    { value: 'Philippines', key: 'PH' },
    { value: 'Pitcairn', key: 'PN' },
    { value: 'Poland', key: 'PL' },
    { value: 'Portugal', key: 'PT' },
    { value: 'Puerto Rico', key: 'PR' },
    { value: 'Qatar', key: 'QA' },
    { value: 'Reunion', key: 'RE' },
    { value: 'Romania', key: 'RO' },
    { value: 'Russian Federation', key: 'RU' },
    { value: 'RWANDA', key: 'RW' },
    { value: 'Saint Helena', key: 'SH' },
    { value: 'Saint Kitts and Nevis', key: 'KN' },
    { value: 'Saint Lucia', key: 'LC' },
    { value: 'Saint Pierre and Miquelon', key: 'PM' },
    { value: 'Saint Vincent and the Grenadines', key: 'VC' },
    { value: 'Samoa', key: 'WS' },
    { value: 'San Marino', key: 'SM' },
    { value: 'Sao Tome and Principe', key: 'ST' },
    { value: 'Saudi Arabia', key: 'SA' },
    { value: 'Senegal', key: 'SN' },
    { value: 'Serbia and Montenegro', key: 'CS' },
    { value: 'Seychelles', key: 'SC' },
    { value: 'Sierra Leone', key: 'SL' },
    { value: 'Singapore', key: 'SG' },
    { value: 'Slovakia', key: 'SK' },
    { value: 'Slovenia', key: 'SI' },
    { value: 'Solomon Islands', key: 'SB' },
    { value: 'Somalia', key: 'SO' },
    { value: 'South Africa', key: 'ZA' },
    { value: 'South Georgia and the South Sandwich Islands', key: 'GS' },
    { value: 'Spain', key: 'ES' },
    { value: 'Sri Lanka', key: 'LK' },
    { value: 'Sudan', key: 'SD' },
    { value: 'Surivalue', key: 'SR' },
    { value: 'Svalbard and Jan Mayen', key: 'SJ' },
    { value: 'Swaziland', key: 'SZ' },
    { value: 'Sweden', key: 'SE' },
    { value: 'Switzerland', key: 'CH' },
    { value: 'Syrian Arab Republic', key: 'SY' },
    { value: 'Taiwan, Province of China', key: 'TW' },
    { value: 'Tajikistan', key: 'TJ' },
    { value: 'Tanzania, United Republic of', key: 'TZ' },
    { value: 'Thailand', key: 'TH' },
    { value: 'Timor-Leste', key: 'TL' },
    { value: 'Togo', key: 'TG' },
    { value: 'Tokelau', key: 'TK' },
    { value: 'Tonga', key: 'TO' },
    { value: 'Trinidad and Tobago', key: 'TT' },
    { value: 'Tunisia', key: 'TN' },
    { value: 'Turkey', key: 'TR' },
    { value: 'Turkmenistan', key: 'TM' },
    { value: 'Turks and Caicos Islands', key: 'TC' },
    { value: 'Tuvalu', key: 'TV' },
    { value: 'Uganda', key: 'UG' },
    { value: 'Ukraine', key: 'UA' },
    { value: 'United Arab Emirates', key: 'AE' },
    { value: 'United Kingdom', key: 'GB' },
    { value: 'United States', key: 'US' },
    { value: 'United States Minor Outlying Islands', key: 'UM' },
    { value: 'Uruguay', key: 'UY' },
    { value: 'Uzbekistan', key: 'UZ' },
    { value: 'Vanuatu', key: 'VU' },
    { value: 'Venezuela', key: 'VE' },
    { value: 'Viet Nam', key: 'VN' },
    { value: 'Virgin Islands, British', key: 'VG' },
    { value: 'Virgin Islands, U.S.', key: 'VI' },
    { value: 'Wallis and Futuna', key: 'WF' },
    { value: 'Western Sahara', key: 'EH' },
    { value: 'Yemen', key: 'YE' },
    { value: 'Zambia', key: 'ZM' },
    { value: 'Zimbabwe', key: 'ZW' },
  ];

  const renderListItem = (item) => {
    return (
      <View style={styles.listItemContainer}>
        <Text style={styles.listItemLabel}>{item.value}</Text>
      </View>
    );
  };

  const renderSectionHeader = (section) => {
    return (
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
      </View>
    );
  };

  const renderIndexLetter = (item) => {
    console.log('ITEM => ', item);
    return (
      <TouchableOpacity key={item.item.title} onPress={item.onPress}>
        <View style={styles.containerLetter}>
          <Text style={styles.textLetter}>{item.item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AlphabetList
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      data={exampleData}
      indexContainerStyle={styles.indexContainer}
      renderCustomIndexLetter={renderIndexLetter}
      renderCustomItem={renderListItem}
      renderCustomSectionHeader={renderSectionHeader}
    />
  );
};

const sizes = {
  itemHeight: 40,
  headerHeight: 30,
  listHeaderHeight: 80,
  spacing: {
    small: 10,
    regular: 15,
    large: 20,
  },
};

const createStyles = (colors) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    indexContainer: {
      width: 40,
    },
    sectionTitle: {
      marginTop: 25,
      marginLeft: 25,
      marginBottom: 25,
    },
    alphabetList: {
      flex: 1,
    },

    listItemContainer: {
      flex: 1,
      height: sizes.itemHeight,
      paddingHorizontal: sizes.spacing.regular,
      justifyContent: 'center',
      borderTopColor: colors.tertiary,
      borderTopWidth: 1,
    },

    listItemLabel: {
      color: colors.text,
      fontSize: 14,
    },

    sectionHeaderContainer: {
      height: sizes.headerHeight,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      paddingHorizontal: sizes.spacing.regular,
    },

    sectionHeaderLabel: {
      color: colors.accent,
      backgroundColor: 'transparent',
      fontSize: 24,
      fontWeight: 600,
    },

    listHeaderContainer: {
      height: sizes.listHeaderHeight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    containerLetter: {
      backgroundColor: `${colors.accent}50`,
      borderRadius: 50,
      paddingHorizontal: 10,
      margin: 2,
    },
    textLetter: {
      fontSize: 20,
      marginTop: -10,
      paddingTop: 5,
      color: colors.text,
    },
  });
  return styles;
};

export default HomeScreens;
