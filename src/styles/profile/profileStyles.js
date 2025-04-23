import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
      flex: 1,
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    header: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 16,
    },
    profileImageContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
    },
    editImageButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    userName: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      marginBottom: 16,
    },
    userStats: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      paddingVertical: 16,
      borderRadius: 12,
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
    },
    separator: {
      width: 1,
      height: 40,
      backgroundColor: '#E0E0E0',
      marginHorizontal: 24,
    },
    ratingStars: {
      flexDirection: 'row',
      marginTop: 4,
    },
    menuCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
      padding: 0,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    menuItemText: {
      flex: 1,
      fontSize: 16,
      marginLeft: 12,
    },
    menuSeparator: {
      height: 1,
      marginHorizontal: 16,
    },
    listingsCard: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    emptyListings: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 24,
    },
    emptyListingsText: {
      fontSize: 16,
      marginTop: 8,
      marginBottom: 8,
    },
    logoutButton: {
      marginHorizontal: 16,
      marginBottom: 24,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: 16,
    },
    modalContent: {
      width: '100%',
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
    },
  });