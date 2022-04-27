import cookies from 'js-cookie';

export function updateUserCookieVotes(data) {
  let user = getUserFromCookie()
  user.mongoData.votedPolls.push(data)
  setUserCookie(JSON.stringify(user))
}

export function updateUserCookiePolls(data) {
  let user = getUserFromCookie()
  user.mongoData.polls.push(data)
  setUserCookie(JSON.stringify(user))
}

export function updateUserCookieEthnicity(data) {
  let user = getUserFromCookie()
  user.mongoData.info.ethnicity = data
  setUserCookie(JSON.stringify(user))
}

export function updateUserCookieGender(data) {
  let user = getUserFromCookie()
  user.mongoData.info.gender = data
  setUserCookie(JSON.stringify(user))
}

export function getUserFromCookie() {
  const cookie = cookies.get('auth');
  if (!cookie) {
    return;
  }
  return JSON.parse(cookie);
};

export function setUserCookie(user){
  cookies.set('auth', user, {
    expires: 1/24,
  });
};

export const removeUserCookie = () => cookies.remove('auth');