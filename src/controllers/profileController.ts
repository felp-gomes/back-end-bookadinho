import express from 'express'
import profiles from '../mocks/profiles'
import OAuth from '../models/OAuth'

export default class ProfileController{
  static listProfiles(req: express.Request, res: express.Response) {
    return res.status(200).json({status: 200, message: profiles})
  }

  static authenticateProfile(req: express.Request, res: express.Response) {
    const {user_name, password}: {user_name: string, password: string} = req.body
    if(!user_name || !password) {
      return res.status(401).send({status: 400, message: 'User name and password profile id are required!'})
    }

    const profile = profiles.find((profile) => profile.user_name === user_name  && profile.password === password) 
    if(!profile || !profile.id) {
      return res.status(400).send({status: 400, message: 'Could not find user or id, contact developer!'})
    }

    try {
      const token = OAuth.createToken({id: profile.id, user_name: profile.user_name})
      // Add token in profile
      return res.status(202).send({status: 202, message: `Authorization: ${token}`})
    } catch (error) {
      console.log('\x1b[31m[TOKEN IS NOT A STRING]\x1b[0m', error);
      res.status(202).send({status: 202, message: `Token is not a string ${error}`})
      throw 'TOKEN IS NOT A STRING';
    }

    
    
  }
}
