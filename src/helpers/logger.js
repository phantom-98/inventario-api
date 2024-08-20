import Log from'../models/Log.js';
import _ from'lodash';

const logUserAction = async (userId, action, prevData = "", newData = "")=> {
  try {
    const log = new Log({
      userId,
      action,
      prevData,
      newData
    });
    await log.save();
    console.log('Acción registrada con éxito:', action);
  } catch (err) {
    console.error('Error al registrar la acción', err);
  }
}

export default logUserAction;

export const getModifiedFields = (original, updated) =>{
  const oldValues = {};
    const newValues = {};

    _.transform(updated, (result, value, key) => {
        if (!_.isEqual(value, original[key])) {
            if (_.isObject(value) && _.isObject(original[key])) {
                const { oldValues: nestedOldValues, newValues: nestedNewValues } = getModifiedFields(original[key], value);

                if (!_.isEmpty(nestedOldValues)) {
                    oldValues[key] = nestedOldValues;
                    newValues[key] = nestedNewValues;
                }
            } else {
                oldValues[key] = original[key];
                newValues[key] = value;
            }
        }
    });

    return { oldValues, newValues };
}


// await logUserAction(req.user.id, 'Created a new resource', { resourceId: newResource._id });