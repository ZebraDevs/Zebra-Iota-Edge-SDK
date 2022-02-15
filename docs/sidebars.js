/**
 * * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
    docs: [
        {
            type: 'category',
            label: 'Zebra IOTA Edge SDK',
            collapsed: false,
            items: [
                'tutorials/zebra-iota-edge-sdk/zebra-iota-edge-sdk-101-tutorial',
                'tutorials/zebra-iota-edge-sdk/zebra-iota-edge-sdk-102-tutorial',
                'tutorials/zebra-iota-edge-sdk/zebra-iota-edge-sdk-103-tutorial',
                'tutorials/zebra-iota-edge-sdk/zebra-iota-edge-sdk-104-tutorial',
            ],
        },
        {
            type: 'category',
            label: 'Track And Trace Ledger API',
            collapsed: false,
            items: [
                'tutorials/track-trace-ledger-api/track-trace-ledger-api-tutorial-101',
                'tutorials/track-trace-ledger-api/track-trace-ledger-api-tutorial-102',
                'tutorials/track-trace-ledger-api/track-trace-ledger-api-tutorial-103',
                'tutorials/track-trace-ledger-api/track-trace-ledger-api-tutorial-201',
            ],
        },
    ],
};
