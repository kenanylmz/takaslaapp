import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 8,
  },
  searchButton: {
    padding: 8,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  activeTab: {
    borderWidth: 1.5,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sortText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  resultsText: {
    fontSize: 14,
    marginBottom: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
    borderRadius: 12,
  },
  cardHeader: {
    padding: 16,
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: width - 32,
    height: 200,
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
    paddingTop: 12,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    marginBottom: 8,
  },
  retryText: {
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  paginationButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  paginationButtonActive: {
    backgroundColor: '#4A80F0',
  },
  paginationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paginationTextActive: {
    color: 'white',
  },
  filterModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  filterModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.7,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterModalSection: {
    marginBottom: 16,
  },
  filterModalSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  cityPickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  cityPickerText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
