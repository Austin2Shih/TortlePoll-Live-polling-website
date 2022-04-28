## TortlePoll
TortlePoll is fully functional and deployed on Vercel [here](https://live-polling-website.vercel.app/)

[TortlePoll](https://live-polling-website.vercel.app/) is a live polling website where users can create and take polls in an instant.

**Features**
- Live results updating in the front-end
- Filter results by demographic group
- Browse and take public polls
- Keep track of polls you've created and voted for

## Note for IGN
TortlePoll was my first time using technologies such as Next.js, Firebase Auth, MongoDB, and Pusher. During the past two weeks, I've had to learn about serverless functions, user persistence with authentication, and controlling web-sockets through countless online tutorials which were unlikely to have followed all of the best web development practices.

This website is a collection of the information that I've absorbed over the past two weeks and I tried implementing as many cool features as I could while making the site reliable. That being said, during some tests, I have run into issues where an element of a page won't load probably due to an authentication issue. This is rare, but in the case that the one time you try to demo my project it fails, please stay patient with my work and refresh the page.

![Image of poll results](/public/home-images/Poll-pic.PNG)

## Technologies used
#### Next.js
Using Next.js allowed me to have an easier time handling the backend of my project and deploy it to Vercel. However, there were a few issues that came with having Server Side Rendering(SSR) such as many libraries not being compatible with SSR as well as many web development tutorials made for React.js that could not easily translate to Next.js.

#### MongoDB
I used MongoDB to store user data and poll data. After succesfully integrating MongoDB into my Next.js app, I created custom endpoints in the app allowing me to query the database and efficiently retrieve information.

#### Pusher
Pusher was the core of my project since we needed live polling. After doing a lot of research on web-sockets, I realized that those options were not as easily done with Next.js since Next.js only supports serverless functions while most web-socket solutions online required you to be running Express.js servers. Also, due to older documentation on both Pusher and Vercel's websites, I ended up having to alter the documented code a lot before I could get reliable live updating.

#### Firebase Auth
Firebase Auth itself was straightforward to implement, but it was user persistence that was difficult. After doing tons of research on user authentication persistence, I still do not know if the way I used cookies to keep track of user data and authentication state is the best way to do it in the industry.


