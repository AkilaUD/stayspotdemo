import authLogin from './auth-login.jpg'
import authRegister from './auth-register.jpg'
import billingCancel from './billing-cancel.jpg'
import billingSuccess from './billing-success.jpg'
import coverPlaceholder from './cover-placeholder.jpg'
import emptyAds from './empty-ads.jpg'
import emptyBrowse from './empty-browse.jpg'
import emptyInbox from './empty-inbox.jpg'
import emptyModeration from './empty-moderation.jpg'
import emptyReviews from './empty-reviews.jpg'
import emptySaved from './empty-saved.jpg'
import emptyViewings from './empty-viewings.jpg'
import errorGeneric from './error-generic.jpg'
import featureTrust from './feature-trust.jpg'
import heroBoarding from './hero-boarding.jpg'
import howLandlordAccount from './how-landlord-account.jpg'
import howLandlordGrow from './how-landlord-grow.jpg'
import howLandlordReview from './how-landlord-review.jpg'
import howRenterBrowse from './how-renter-browse.jpg'
import howRenterChat from './how-renter-chat.jpg'
import howRenterUnlock from './how-renter-unlock.jpg'

/**
 * Bundled Unsplash photos (unique per surface). Attribution:
 * hero — living room (photo-1522708323590); auth login — loft (photo-1493809842364);
 * auth register — apartment exterior (photo-1560448204); trust — keys (photo-1560518883);
 * how-it-works — kitchen browse, keys unlock, laptop chat, house, desk review, analytics grow;
 * empties / billing / error / cover — distinct Unsplash IDs in filenames' download URLs.
 */
export const illustrations = {
  heroBoarding,
  authLogin,
  authRegister,
  emptyBrowse,
  emptyInbox,
  emptyAds,
  emptyReviews,
  emptySaved,
  emptyViewings,
  emptyModeration,
  billingSuccess,
  billingCancel,
  errorGeneric,
  featureTrust,
  coverPlaceholder,
  howRenterBrowse,
  howRenterUnlock,
  howRenterChat,
  howLandlordAccount,
  howLandlordReview,
  howLandlordGrow,
} as const
