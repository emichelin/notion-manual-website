# How to Get Your Notion Page ID

Since you're using a share link (`bulletdatabaseprivatelink.notion.site/main`), here's how to get the actual page ID:

## Method 1: From Browser (Easiest)

1. Open your Notion page: https://bulletdatabaseprivatelink.notion.site/main
2. Right-click and select "View Page Source" (or press Cmd+Option+U on Mac)
3. Press Cmd+F (or Ctrl+F) to search
4. Search for: `"pageId"` or `"blockId"`
5. You should find something like: `"pageId":"a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"`
6. Copy the ID (the long string of letters and numbers)

## Method 2: From Browser Console

1. Open your Notion page: https://bulletdatabaseprivatelink.notion.site/main
2. Press F12 (or Cmd+Option+I on Mac) to open Developer Tools
3. Go to the Console tab
4. Type: `window.location.pathname` and press Enter
5. Or look for any variable containing the page ID in the console

## Method 3: Check the URL

Sometimes when you open the share link, Notion redirects to a URL with the page ID. Check if the URL changes to something like:
`https://www.notion.so/Your-Page-Title-7875426197cf461698809def95960ebf`

The page ID is the last part (32 characters).

## Once You Have the ID

The page ID should be 32 characters long, like: `7875426197cf461698809def95960ebf`

Share it with me and I'll update your configuration!

