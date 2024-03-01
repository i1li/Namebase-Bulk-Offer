# Namebase Bulk Offer
Sends bulk offers for available names on Namebase. Cleans various inputs and allows a set price for all offers that can be individually overriden.

Examples of inputs that are cleaned and accepted:

Copy and paste of an entire page of Namebase search results. (Ctrl + A , Ctrl + C, Ctrl + V)

The URL for a Namebase name, like https://www.namebase.io/domains/combutbetter , or copy and paste an entire folder of bookmarked name URLs.

You can even get a list of names from your counter offer emails, by selecting them all in gmail, clicking 'send as attachment', and then copy & pasting the attachment text, which would look like "Counteroffer for combutbetter.eml (29k)"

In all those cases you can add a comma followed by a price to the end of any name's line to override the default offer price entered.

## Directions
There are two options:

1. The most convenient is the bookmarklet method. Just create a new bookmark with any name like 'offer'. Copy and paste the contents of offer-bookmarklet.js into the URL field. (made from offer.js with ['bookmarkletify' VS Code extension](https://marketplace.visualstudio.com/items?itemName=saasan.bookmarkletify).
   
2. Copy and paste contents of offer.js into browser dev tools console.

### Other Handshake related things I made:
[Punytag](https://github.com/i1li/punytag) - Unicode, Punycode, tagging, and page creation for Handshake name porfolios.

[List of Handshake related repos](https://github.com/stars/i1li/lists/hns)
