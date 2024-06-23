const {identify, lock} = require('zigbee-herdsman-converters/lib/modernExtend');
// Add the lines below
const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const tz = require('zigbee-herdsman-converters/converters/toZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const reporting = require('zigbee-herdsman-converters/lib/reporting');
const ota = require('zigbee-herdsman-converters/lib/ota');
const utils = require('zigbee-herdsman-converters/lib/utils');
const globalStore = require('zigbee-herdsman-converters/lib/store');
const e = exposes.presets;
const ea = exposes.access;


const fzLocal = {
    action_source_name: {
        cluster: "closuresDoorLock",
        type: "raw",
        convert: (model, msg, publish, options, meta) => {
            const lookup = {
                0: 'password_unlock', //'unknown', // password 15/07
                1: 'unlock', //'lock', unlock system 15/07
                2: 'auto_lock', // 'unlock', // one touch lock and autolock 15/07
                3: 'RFID_unlock', //'lock_failure_invalid_pin_or_id', // card 15/07
                4: 'fingerprint_unlock', //'lock_failure_invalid_schedule',  // fingerprint 15/07
                5: 'unlock_failure_invalid_pin_or_id',
                6: 'unlock_failure_invalid_schedule',
                7: 'one_touch_lock',
                8: 'key_lock',
                9: 'key_unlock',
                10: 'auto_lock',
                11: 'schedule_lock',
                12: 'schedule_unlock',
                13: 'manual_lock',
                14: 'manual_unlock',
                15: 'non_access_user_operational_event',
            };
            const value = lookup[msg.data[3]];
            return { action_source_name: value }
        },
    },
    action_source_user: {
        cluster: "closuresDoorLock",
        type: "raw",
        convert: (model, msg, publish, options, meta) => {
            return { action_source_user: msg.data[5] };
        },
    },
};

const definition = {
    zigbeeModel: ['YMC420', 'YMC 420D', 'YMC 420 D'],
    model: 'YMC420',
    vendor: 'Yale',
    description: 'Automatically generated definition',
    fromZigbee: [fzLocal.action_source_user, fzLocal.action_source_name, fz.lock, fz.battery, fz.lock_operation_event, fz.lock_programming_event, fz.lock_pin_code_response, fz.lock_user_status_response], // We will add this later
    toZigbee: [tz.lock, tz.pincode_lock, tz.lock_userstatus], // Should be empty, unless device can be controlled (e.g. lights, switches).
    extend: [identify(), lock({"pinCodeCount":250})],
    meta: {},
};

module.exports = definition;