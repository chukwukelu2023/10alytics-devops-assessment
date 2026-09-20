import { Model, DataTypes } from "sequelize";
import {sequelize} from "../database/db"
import ITask from "../interface/taskInterface";

export class Tasks extends Model<ITask> {
    userId: any;
}

Tasks.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM,
    values: ['PENDING', 'INPROGRESS', 'ONHOLD', 'COMPLETED'],
    allowNull: true,
    defaultValue: 'PENDING',
    validate: {
      isIn: [['PENDING', 'PROGRESS', 'ONHOLD', 'COMPLETED']]
    }
  },
  dateCreated: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: new Date()
  },
  dateCompleted: {
    type: DataTypes.DATE,
    allowNull: true,
  },
},{
    sequelize,
    modelName:"tasks",
    timestamps:false
})

