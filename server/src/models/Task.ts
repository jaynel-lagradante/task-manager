import { DataTypes, Model } from "sequelize";
import sequelize from '../config/database';
import Subtask from './Subtask';

class Task extends Model {
    public id!: string;
    public title!: string;
    public description!: string;
    public due_date!: Date;
    public priority!: string;
    public status!: string;
    public user_id!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

Task.init(
    {
        id: { type: DataTypes.STRING(50), primaryKey: true },
        title: { type: DataTypes.STRING(255), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        due_date: { type: DataTypes.DATE, allowNull: false },
        priority: { type: DataTypes.STRING(20), allowNull: false },
        status: { type: DataTypes.STRING(20), allowNull: false },
        user_id: { type: DataTypes.STRING(50), allowNull: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE },
        date_completed: { type: DataTypes.DATE },
    },
    { sequelize, tableName: "task", modelName: "Task", underscored: true }
);

Task.hasMany(Subtask, { foreignKey: 'task_id', as: 'subtasks' });

export default Task;