# CBSocial

A social network example which uses Couchbase as the data store

## Requirements

As an user of this service/application I want to be able to:

* Register with your email address and password
* Login with an email address and password
* Post public messages
* Post a direct message to another user
* Search for friends those are also using the application/service
* Add another user as a friend
* See all the messages those were posted by my friends

## Data Model

* User

```
user::$email :
{
  'email' : '$email',
  'password' '$passwordhash',
  'first_name' : '$firstName',
  'last_name' : '$lastName',
  'avatar' : $avatar,
  'friends' : { 'confirmed' : [...], 'pending' : [...] }
}
```

* Session
```
session::$email :
{
  'token' : '$token'
}
```

* Public Message
```
msg::public::$email::$count :
{
  'titel' : '$title',
  'msg' : '$msg',
  'is_hidden' : true|false,
}
```

* Direct Message
```
msg::direct::$email::$count :

{
  'titel' : '$title',
  'msg' : '$msg',
  'receivers' : [...]
}
```

* Msg Ref
```
msg::direct::ref::$from::$to :
{
  'messages' : [...]
}
```
