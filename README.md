# CBSocial

A social network example which uses Couchbase as the data store

## Requirements

As an user of this service/application I want to be able to:

* Register with your email address and password
* Login with an email address and password
* Post public messages
* Search for friends those are also using the application/service
* Add another user as a friend
* See all the messages those were posted by my friends

## Data Model
```
user::$email :

{
  'email' : '$email',
  'first_name' : '$firstName',
  'last_name' : '$lastName',
  'avatar' : $avatar
}



```
