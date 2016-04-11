/*
 * Copyright (C) 2016 www.phantombot.net
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* 
 * @author IllusionaryOne
 */

/*
 * greetingsPanel.js
 * Drives the Greetings Panel
 */
(function() {

   var refreshIcon = '<i class="fa fa-refresh" />',
       spinIcon = '<i style="color: magenta" class="fa fa-spinner fa-spin" />',
       settingIcon = [];
       settingIcon['false'] = '<i style="color: magenta" class="fa fa-circle-o" />';
       settingIcon['true'] = '<i style="color: magenta" class="fa fa-circle" />';

    /*
     * onMessage
     * This event is generated by the connection (WebSocket) object.
     */
    function onMessage(message) {
        var msgObject;

        try {
            msgObject = JSON.parse(message.data);
        } catch (ex) {
            return;
        }

        if (panelHasQuery(msgObject)) {
            var key = "",
                value = "";
     
            if (panelCheckQuery(msgObject, 'greetings_greeting')) {
                for (idx in msgObject['results']) {
                    key = msgObject['results'][idx]['key'];
                    value = msgObject['results'][idx]['value'];

                    if (panelMatch(key, 'autoGreetEnabled')) {
                        $('#globalGreetings').html(settingIcon[value]);
                    }
                    if (panelMatch(key, 'defaultJoin')) {
                        $('#greetingDefaultInput').attr('placeholder', value).blur();
                    }
                    if (panelMatch(key, 'cooldown')) {
                        $('#greetingCooldownInput').attr('placeholder', value).blur();
                    }
                }
            }

            if (panelCheckQuery(msgObject, 'greetings_followReward')) {
                $('#followerRewardInput').attr('placeholder', msgObject['results']['followReward']).blur();
            }

            if (panelCheckQuery(msgObject, 'greetings_followMessage')) {
                $('#followerGreetingInput').attr('placeholder', msgObject['results']['followMessage']).blur();
            }

            if (panelCheckQuery(msgObject, 'greetings_followToggle')) {
                $('#followerGreetings').html(settingIcon[msgObject['results']['followToggle']]);
            }

            if (panelCheckQuery(msgObject, 'greetings_donation')) {
                for (idx in msgObject['results']) {
                    key = msgObject['results'][idx]['key'];
                    value = msgObject['results'][idx]['value'];

                    if (panelMatch(key, 'announce')) {
                        $('#donationGreetings').html(settingIcon[value]);
                    }
                    if (panelMatch(key, 'reward')) {
                        $('#donateRewardInput').attr('placeholder', value);
                    }
                    if (panelMatch(key, 'message')) {
                        $('#donateGreetingInput').attr('placeholder', value);
                    }
                    if (panelMatch(key, 'lastmessage')) {
                        $('#donateLastMsgInput').attr('placeholder', value);
                    }
                }
            }

            if (panelCheckQuery(msgObject, 'greetings_subscribers')) {
                for (idx in msgObject['results']) {
                    key = msgObject['results'][idx]['key'];
                    value = msgObject['results'][idx]['value'];

                    if (panelMatch(key, 'subscribeMessage')) {
                        $('#subGreetingInput').attr('placeholder', value);
                    }
                    if (panelMatch(key, 'reSubscribeMessage')) {
                        $('#resubGreetingInput').attr('placeholder', value);
                    }
                    if (panelMatch(key, 'subscriberWelcomeToggle')) {
                        $('#subscriptionGreetings').html(settingIcon[value]);
                    }
                    if (panelMatch(key, 'reSubscriberWelcomeToggle')) {
                        $('#resubscriptionGreetings').html(settingIcon[value]);
                    }
                    if (panelMatch(key, 'subscribeReward')) {
                        $('#subRewardInput').attr('placeholder', value);
                    }
                }
            }

            if (panelCheckQuery(msgObject, 'greetings_gamewisp')) {
                for (idx in msgObject['results']) {
                    key = msgObject['results'][idx]['key'];
                    value = msgObject['results'][idx]['value'];

                    if (panelMatch(key, 'subscriberShowMessages')) {
                        $('#gameWispGreetings').html(settingIcon[value]);
                    }
                    if (panelMatch(key, 'subscribeMessage')) {
                        $('#gwSubGreetingInput').attr('placeholder', value);
                    }
                    if (panelMatch(key, 'reSubscribeMessage')) {
                        $('#gwResubGreetingInput').attr('placeholder', value);
                    }
                    if (panelMatch(key, 'tierUpMessage')) {
                        $('#gwTierupGreetingInput').attr('placeholder', value);
                    }
                    if (panelMatch(key, 'subscribeReward')) {
                        $('#gwSubRewardInput').attr('placeholder', value);
                    }
                    if (panelMatch(key, 'reSubscribeReward')) {
                        $('#gwResubRewardInput').attr('placeholder', value);
                    }
                }
            }

            if (panelCheckQuery(msgObject, 'greetings_gamewispTiers')) {
                var tier = "",
                    html = "",
                    songRequestHtml = "<table>",
                    bonusPointsHtml = "<table>",
                    subBonusPointsHtml = "<table>";
 
                for (idx in msgObject['results']) {
                    key = msgObject['results'][idx]['key'];
                    value = msgObject['results'][idx]['value'];
                    tier = key[key.indexOf('_') + 1];
                    html = '<tr class="textList">' +
                           '    <td>Tier ' + tier + '</td>' +
                           '    <td style="vertical-align: middle">' +
                           '        <input type="number" min="0" id="inline_' + key + '"' +
                           '               placeholder="' + value + '" value="' + value + '"' +
                           '               style="width: 8em" />' +
                           '        <button type="button" class="btn btn-default btn-xs"' +
                           '                onclick="$.updateGWTierData(\'' + key + '\')"><i class="fa fa-pencil" />' +
                           '        </button>' +
                           '    </td>' +
                           '</tr>';
                    if (key.startsWith('songrequest_') === true) { songRequestHtml += html; }
                    if (key.startsWith('bonuspoints_') === true) { bonusPointsHtml += html; }
                    if (key.startsWith('subbonuspoints_') === true) { subBonusPointsHtml += html; }
                }

                $('#gameWispSongRequests').html(songRequestHtml);
                $('#gameWispBonusPoints').html(bonusPointsHtml);
                $('#gameWispSubBonusPoints').html(subBonusPointsHtml);
            }
        }
    }

    /**
     * @function doQuery
     */
    function doQuery() {
        sendDBKeys('greetings_greeting', 'greeting');
        sendDBQuery('greetings_followReward', 'settings', 'followReward');
        sendDBQuery('greetings_followMessage', 'settings', 'followMessage');
        sendDBQuery('greetings_followToggle', 'settings', 'followToggle');
        sendDBKeys('greetings_donation', 'donations');
        sendDBKeys('greetings_subscribers', 'subscribeHandler');
        sendDBKeys('greetings_gamewisp', 'gameWispSubHandler');
        sendDBKeys('greetings_gamewispTiers', 'gameWispTiers');
    }

    /**
     * @function updateGWTierData
     * @param {String} key
     */
    function updateGWTierData(key) {
        var value = $('#inline_' + key).val();

        if (value.length > 0) {
            sendDBUpdate('greetings_updateTier', 'gameWispTiers', key, value);
            setTimeout(function() { sendCommand('gamewisppanelupdate'); doQuery(); }, TIMEOUT_WAIT_TIME);
        }
    }

    /**
     * @function toggleGreetings
     * @param {String} table
     * @param {String} key
     */
    function toggleGreetings(table, key)
    {
        if (panelMatch(table, 'greeting')) {
            $('#globalGreetings').html(spinIcon);
            sendCommand('greeting toggledefault');
        }
        if (panelMatch(table, 'settings')) { // Confusing? Follow is in the settings table.
            $('#followerGreetings').html(spinIcon);
            sendCommand('followtoggle'); 
        }
        if (panelMatch(table, 'donations')) { 
            $('#donationGreetings').html(spinIcon);
            sendCommand('donations announce');
        }
        if (panelMatch(table, 'subscribeHandler') && panelMatch(key, 'subscriberWelcomeToggle')) { 
            $('#subscriptionGreetings').html(spinIcon);
            sendCommand('subwelcometoggle');
        }
        if (panelMatch(table, 'subscribeHandler') && panelMatch(key, 'reSubscriberWelcomeToggle')) { 
            $('#resubscriptionGreetings').html(spinIcon);
            sendCommand('resubwelcometoggle');
        }
        if (panelMatch(table, 'gameWispSubHandler') && panelMatch(key, 'subscriberShowMessages_on')) { 
            $('#gameWispGreetings').html(spinIcon);
            sendCommand('gamewisp togglemessage on');
        }
        if (panelMatch(table, 'gameWispSubHandler') && panelMatch(key, 'subscriberShowMessages_off')) { 
            $('#gameWispGreetings').html(spinIcon);
            sendCommand('gamewisp togglemessage off');
        }
        setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME);
    }

    /**
     * @function updateGreetingData
     * @param {String} inputId
     * @param {String} table
     * @param {String} key
     */
    function updateGreetingData(inputId, table, key)
    {
        var value = $('#' + inputId).val();

        if (value.length > 0) {
            sendDBUpdate('greetings_update', table, key, value);

            if (panelMatch(table, 'greeting')) {
                sendCommand('greetingspanelupdate');
            }
            if (panelMatch(table, 'settings')) { // Confusing? Follow is in the settings table.
                sendCommand('followerpanelupdate');
            }
            if (panelMatch(table, 'donations')) {
                sendCommand('donationpanelupdate');
            }
            if (panelMatch(table, 'subscribeHandler')) {
                sendCommand('subscriberpanelupdate');
            }
            if (panelMatch(table, 'gameWispSubHandler')) {
                sendCommand('gamewisppanelupdate');
            }
            setTimeout(function() { doQuery(); }, TIMEOUT_WAIT_TIME);
        } 
    }


    // Import the HTML file for this panel.
    $('#greetingsPanel').load('/panel/greetings.html');

    // Load the DB items for this panel, wait to ensure that we are connected.
    var interval = setInterval(function() {
        if (isConnected && TABS_INITIALIZED) {
            var active = $("#tabs").tabs("option", "active");
            if (active == 7) {
                doQuery();
                clearInterval(interval);
            }
        }
    }, INITIAL_WAIT_TIME);

    // Query the DB every 30 seconds for updates.
    setInterval(function() {
        var active = $('#tabs').tabs('option', 'active');
        if (active == 7 && isConnected) {
            newPanelAlert('Refreshing Greeting Data', 'success', 1000);
            doQuery();
        }
    }, 3e4);

    // Export functions - Needed when calling from HTML.
    $.greetingsOnMessage = onMessage;
    $.toggleGreetings = toggleGreetings;
    $.updateGreetingData = updateGreetingData;
    $.updateGWTierData = updateGWTierData;
})();
