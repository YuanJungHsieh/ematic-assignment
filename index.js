require("dotenv").config();

const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: "us18",
});

// add list
const event = {
  name: "11/11 shopping festival",
};

const footerContactInfo = {
  company: "123 Company",
  address1: "ABC Street",
  zip: "110",
  city: "Taipei",
  country: "TW",
};

const campaignDefaults = {
  from_name: "Leo Hsieh",
  from_email: "leohsieh1001@gmail.com",
  subject: "11/11 shopping festival",
  language: "EN_US",
};

async function addList() {
  const response = await mailchimp.lists.createList({
    name: event.name,
    contact: footerContactInfo,
    permission_reminder: "permission_reminder",
    email_type_option: true,
    campaign_defaults: campaignDefaults,
  });
  // get list id
  console.log(`list added, list id is ${response.id}`);
}

addList();

// add my email to the list
const listId = "aaf05c85ad";
const addMyEmail = async () => {
  const response = await mailchimp.lists.addListMember(listId, {
    email_address: "leoleo851001@gmail.com",
    status: "subscribed",
    merge_fields: {
      FNAME: "Leo",
    },
  });
  // contact id
  console.log(`email added to the list, contact id is ${response.id}`);
};

addMyEmail();

// add assigned email to the list
const mailList = [
  {
    email_address: "ryan.ramadhan@ematicsolutions.com",
    status: "subscribed",
    merge_fields: {
      FNAME: "Ryan",
    },
  },
  {
    email_address: "edwin.melendez@ematicsolutions.com",
    status: "subscribed",
    merge_fields: {
      FNAME: "Edwin",
    },
  },
  {
    email_address: "christianto@ematicsolutions.com",
    status: "subscribed",
    merge_fields: {
      FNAME: "Christianto",
    },
  },
];

const addMailList = async () => {
  const response = await mailchimp.lists.batchListMembers(listId, {
    members: mailList,
  });
  console.log(response);
};

addMailList();

// create mail template
const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <h1>Final Offer for the 11/11 sale</h1>
    <img
      src="https://www.technocrazed.com/wp-content/uploads/2021/03/image.jpeg"
      width="200"
    />
    <p>
      please check out our
      <a href="https://www.ematicsolutions.com/tw/">website</a>to get discounts.
    </p>
  </body>
// </html>`;

const addTemplate = async () => {
  const response = await mailchimp.templates.create({
    name: "leo_template",
    html,
  });
  // get template id
  console.log(response.id);
};

addTemplate();

// add campaign
const templateId = 10554726;
const addCampaign = async () => {
  const response = await mailchimp.campaigns.create({
    type: "plaintext",
    recipients: {
      list_id: listId,
    },
    settings: {
      subject_line: "11/11 Shopping Festival",
      preview_text: "Don't miss this amazing chance!",
      title: "leo_campaign",
      template_id: templateId,
      from_name: "123 Company",
      reply_to: "leohsieh1001@gmail.com",
      to_name: "*|FNAME|*",
      auto_footer: true,
      inline_css: true,
    },
    tracking: {
      opens: true,
      html_clicks: true,
    },
  });
  // get campaign id
  console.log(response.id);
};

addCampaign();

// send campaign
const campaignId = "84496f5ac6";
const sendCampaign = async () => {
  const response = await mailchimp.campaigns.send(campaignId);
  // if success, return empty
  console.log(response);
};

sendCampaign();
