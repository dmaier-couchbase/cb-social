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

There are two kinds of friend relations. Confirmed and pending. A relation is pending until accepted by the requested user. The pending list is a quite short list and so it is relized as a JSON array. The confirmed friends list could be quite huge because one user can have thousands of friends.

1. Get the friend counter
2. Perform a multi-get to get all confirmed friends
3. For each friend: 
3.1. If the friend is missing then skip it. If the friend has the status 'deleted' then skip it.
3.2. Get the user to which the friend relation is existing

One friend list contains up to 1000 entries.

```
friends::$email::pending :
{
    to_confirm : [...]
}

friend::$from::$count :
{
    'from' : '$from',
    'to' : '$to',
    'status' : 'active|deleted'
}
```

* Session

A session for a user which is identified by his email address is expressed as a session token.

```
session::$email :
{
  'user' : $email,
  'token' : '$token'
}
```

* Public Message

Public messages of a specific user

```
msg::public::$email::$count :
{
  'titel' : '$title',
  'msg' : '$msg',
  'is_hidden' : true|false,
  'time' : $dateTimeAsLong
}
```

* Direct Message

A direct message sent from a user with a specific email address. This is used to get all direct messages those were sent by me.

```
msg::direct::$from::$count :

{
  'titel' : '$title',
  'msg' : '$msg',
  'time' : $dateTimeAsLong,
  'receivers' : [...]
}
```

* Msg Ref

The reference to find all direct messages those were sent to me :

```
msg::direct::ref::$to :
{
  'messages' : [...]
}
```

## Services

The services behave the following way:

* GET: If no error occoured then actual data is returned.
* POST: If no error occoured then the object '{"success" : true }' is returned.
* Error: If an error occured then the result will have an error attribute which contains the the higher level error message as the value, e.g.: '{"error":"Authentication error"}' 

The services are not working resource, but fully parameter based. If some mandatory parameters are missing then an error message will be returned. Side note: This is not 100% alligned with the RESTFul approach which is resource based whereby the id of the resource is typically a part of the URL.

So instead:

```
PUT /service/users/$email

{
  'email' : 'david.maier@couchbase.com',
  'password' 'test',
  'first_name' : 'David',
  'last_name' : 'Maier',
}
```

the parameters are passed directly:

```
POST /service/users/update?email=$email&password=$pwd&first_name=$firstName&last_name=$lastName
```

### Users

* Create an User

The registration of a user is possible without any authentication.

```
POST /service/users/create?email=$email&password=$pwd&first_name=$firstName&last_name=$lastName[&avatar=$avatar]
```

* Get an User

In order to get the user details of a user with a specific email address, you need to authenticate yourself.

```
GET /service/users/get?email=$email&user=$user&token=$token
```

* Get all Users

An authentication is required. An index on the user id-s is required.

```
GET /service/users/all?user=$user&token=$token
```

* Update your own User Profile

```
POST /update[?first_name=$firstName][&last_name=$lastName][&password=$pwd][&avatar=$avatar]&user=$user&token=$token
```

* Find a user 

... by doding a search on the first name or last name. An index on the first name and last name is required in order to perform LIKE searches.

```
GET /service/users/find?text=$text&user=$user&token=$token
```

### Sessions

* Login

Get a login by creating a session token based on the stored password.

```
GET /service/sessions/login?user=$user&secret=$secret
```

* Logout

Delete the session token of a user

```
POST /service/sessions/logout?user=$user&token=$token
```


