import { application } from "express";

const account = {
    name : 'Account',
    default : accountDashboard,
    template : 'account'
  };
  application.add(account)