// To make this file work with node, we are using require instead of import.
// The require throws the "yarn build" into a different mode where it does not
// like ES6 at all.  So in this file, we are going old school and not using
// anything like arrow functions, destructuring, string interpolation, etc.

const firebase = require('../firebase');
const _ = require('lodash');

module.exports = {
  syncRemedies: syncRemedies,
  pushRemedy: pushRemedy,
  pushRemedyItem: pushRemedyItem,
  updateRemedyItem: updateRemedyItem,
};

function syncRemedies(callback) {
  callback = callback || function () {};
  firebase.database()
    .ref('chat/remedies')
    .orderByKey().limitToLast(100)
    .on('value', function (snap) {
      // Use lodash map to:
      //     (1) convert snap.val() object into a remedies array
      //     (2) pull the key down into the remedy object
      const remedies = _.map(snap.val(), function (remedy, key) {
        remedy.key = key;
        return remedy;
      });
      callback(remedies);
    }, console.error);
}

function pushRemedy(remedy) {
  return firebase.database()
    .ref('chat/remedies')
    .push(remedy)
    .catch(function (err) {
      console.error(err);
      return Promise.reject(err);
    });
}

function pushRemedyItem(remedyId) {
  return firebase.database()
    .ref('chat/remedies/' + remedyId + '/itemIds')
    .push({isAvailable: true})
    .catch(function (err) {
      console.error(err);
      return Promise.reject(err);
    });
}

function updateRemedyItem(remedyItem, remedyId) {
  return firebase.database()
    .ref('chat/remedies/' + remedyId + 'itemIds')
    .update(remedyItem)
    .catch(function (err) {
      console.error(err);
      return Promise.reject(err);
    });
}