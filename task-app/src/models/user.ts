import { Model, DataTypes } from "sequelize";
import {sequelize} from "../database/db"
import { Tasks } from "./task";
import { IUser } from "../interface/userInterface";

export class User extends Model<IUser> {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    firstName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull:false
    },
    email:{
        type: DataTypes.STRING,
        allowNull : false,
        unique: true,
        validate:{
            isEmail : true,
            min:3,
            max:100
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false
    },
    isAdmin:{
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
    
},{
    sequelize,
    modelName:"users",
    timestamps:false
})

User.hasMany(Tasks)

