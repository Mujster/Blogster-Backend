# Blogster-Backend

Blogster is an online blogging platform developed using Node.js, Express, and MongoDB. It allows users to create, edit, and publish their blog posts, as well as interact with other bloggers.

## Features
`User Authentication`: Secure user authentication using JSON Web Tokens (JWT) ensures that users can create accounts, log in securely, and access their personalized content without repeatedly entering credentials.

`Blog Post Management`: Users can create, edit, and delete their blog posts. The application supports rich text editing to enhance the blogging experience.

`Comments`: Users can engage with others by leaving comments on blog posts. This fosters a sense of community and interaction within the Blogster platform.

`Prerequisites`
Before running Blogster Backend locally, ensure you have the following installed:

`Node.js`
`MongoDB`

### Clone the repository:

`git clone https://github.com/your-username/blogster.git`

### Registration
#### Email Verification Flow:

`User Registration:`
When a user registers, generate a unique verification token for that user.

`Send Verification Email:`
Use the Gmail API to send an email to the user's registered email address.
Include the verification token in the email body or as a link.

`Verification Token:`
The email should contain instructions for the user to click on the verification link or enter the verification code.

`Verification Endpoint:`
Set up an endpoint in your application to handle the verification process.
Extract the token from the link or the code from the email.

`Verify Email:`
Compare the received token with the one stored during user registration.
If they match, mark the user's email as verified in your database.

### Next Update
-> `Modify Responses and Response Time`

### Accepting Donations For Paid Services

`Using MongoDb Atlas Free Tier`
<br/>
`Need Hosting Funds`

<div align="center">
<a href='https://www.buymeacoffee.com/mujster' target='_blank'><img height='64' style='border:0px;height:64px;' src='https://storage.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
</div>