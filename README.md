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

The user document stores the basic user data

```
user::$email :
{
  'email' : '$email',
  'password' '$password',
  'first_name' : '$firstName',
  'last_name' : '$lastName',
  'avatar' : $avatar,
}
```

* Friends

There are two kinds of friend relations. Confirmed and pending. A relation is pending until accepted by the requested user. The pending list is a quite short list and so it is relized as a JSON array. The confirmed friend list is an append only String list because it may become quite big. '#a' means that an entry was added to the list.  '#d' means that an entry was deleted from the list. Multiple lists need to be maintained because a user can have thousands of friends. So in order to get all friends of a user the following steps need to be peformed:

1. Perform a multi-get to get all confirmed friend lists
2. For each list parse the list
3. Iterate over the list, if the last id for a user starts with '#a' then this is a friend. Otherwise it was a past friend.

One friend list contains up to 100 entries.

```
friends::$email::pending :
{
    to_confirm : [...]
}

friends::$email::confirmed::$count :
{
    a#$user1;a#user2;d#$user1;...
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
