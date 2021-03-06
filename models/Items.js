define(['../utils/MoveSupport', '../utils/Translations'], function (MoveSupport, Translations) {

    var exports = {},

    items = {
        healthvial : {
            name              : 'healthvial',
            selectionType     : MoveSupport.selectionTypes['one'],
            dollarCost        : 100,
            baseExp           : 3,
            details           : { characterClass : 'al',
                                  type           : 'item',
                                  element        : 'heal' },
            getBaseMultiplier :
                function(modifiers) {
                    var alchemistMultiplier = 2;
                    if (modifiers.activeType == this.details.characterClass) {
                        return alchemistMultiplier;
                    }
                    return 1.0;
                },
            baseHpIncrease        : 100,
            execute           :
                function (user, target) {
                    return MoveSupport.executeOne(MoveSupport.hpIncrease, user, target, this);
                }
        },

        bomb : {
            name              : 'bomb',
            selectionType     : MoveSupport.selectionTypes['one'],
            dollarCost        : 50,
            baseExp           : 3,
            details           : { characterClass : 'al',
                                  type           : 'item',
                                  element        : 'none' },
            getBaseMultiplier :
                function(modifiers) {
                    var alchemistMultiplier = 2.8;
                    if (modifiers.activeType == this.details.characterClass) {
                        return alchemistMultiplier;
                    }
                    return 1.0;
                },
            baseDamage        : 350,
            execute           :
                function (user, target) {
                    return MoveSupport.executeOne(MoveSupport.offensive, user, target, this);
                }
        },

        lifeorb : {
            name              : 'lifeorb',
            selectionType     : MoveSupport.selectionTypes['one'],
            dollarCost        : 150,
            baseExp           : 3,
            details           : { characterClass : 'al',
                                  type           : 'item',
                                  element        : 'none' },
            getBaseMultiplier :
                function(modifiers) {
                    var alchemistMultiplier = 3.3;
                    if (modifiers.activeType == this.details.characterClass) {
                        return alchemistMultiplier;
                    }
                    return 1.0;
                },
            basePercentage    : 15,
            execute           :
                function(user, target) {
                    return MoveSupport.executeOne(MoveSupport.revive, user, target, this);
                }
        },

        magicvial : {
            name              : 'magicvial',
            selectionType     : MoveSupport.selectionTypes['one'],
            dollarCost        : 50,
            baseExp           : 3,
            details           : { characterClass : 'al',
                                  type           : 'item',
                                  element        : 'none' },
            getBaseMultiplier :
                function(modifiers) {
                    var alchemistMultiplier = 2;
                    if (modifiers.activeType == this.details.characterClass) {
                        return alchemistMultiplier;
                    }
                    return 1.0;
                },
            baseMpIncrease    : 50,
            execute           :
                function(user, target) {
                    return MoveSupport.executeOne(MoveSupport.mpIncrease, user, target, this);
                }
        }
    },

    partyItems = [];

    function debitPartyItems(itemIndex) {
        if (--partyItems[itemIndex].amount == 0) {
            partyItems.splice(itemIndex, 1);
        }
    }

    function getPartyItemIndexByName(name) {
        var index = -1;
        for (var item in partyItems) {
            if (partyItems[item].name === name) {
                index = item;
                break;
            }
        }
        return index;
    }

    exports.addPartyItem = function(item, amount) {
        if (typeof items[item] === 'undefined') {
            throw new Error('Not an item.');
        }

        if (typeof amount === 'undefined') {
            throw new Error('Must specify an amount when adding party items.');
        }

        var itemIndex = getPartyItemIndexByName(item);

        if (itemIndex > -1) {
            partyItems[itemIndex].amount += amount;
        }
        else {
            var newItem = {
                name   : item,
                amount : amount,
                selectionType : items[item].selectionType,
                type : items[item].details.type
            };
            partyItems.push(newItem);
            partyItems.sort(function(a, b) {
                if (a.name < b.name) {
                    return -1;
                }
                else {
                    return 1;
                }
            });
        }
    };

    exports.getItems = function () {
        return items;
    };

    exports.getPartyItems = function () {
        return partyItems;
    };

    exports.getAmountOfPartyItem = function (item) {

        var itemIndex = getPartyItemIndexByName(item),
            amount = 0;

        if (itemIndex > -1) {
            amount = partyItems[itemIndex].amount;
        }

        return amount;
    };

    exports.getItemCost = function (item) {

        return items[item].dollarCost;
    };

    exports.useItem = function (item, user, target, freebie) {

        if (!freebie) {
            debitPartyItems(getPartyItemIndexByName(item));
        }

        return items[item].execute(user, target);
    };

    return exports;
});
