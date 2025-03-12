import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Subtask extends Model {
    public id!: string;
    public status!: string;
    public title!: string;
    public task_id!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

Subtask.init(
    {
        id: { type: DataTypes.STRING(50), primaryKey: true },
        status: { type: DataTypes.STRING(20), allowNull: false },
        title: { type: DataTypes.STRING(255), allowNull: false },
        task_id: { type: DataTypes.STRING(50), allowNull: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE },
    },
    { sequelize, tableName: 'subtask', modelName: 'Subtask', underscored: true }
);

export default Subtask;
