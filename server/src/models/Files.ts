import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Task from './Task';

class File extends Model {
    public id!: string;
    public task_id!: string;
    public file_name!: string;
    public file_data!: Buffer;
    public created_at!: Date;
}

File.init(
    {
        id: { type: DataTypes.STRING, primaryKey: true },
        task_id: { type: DataTypes.STRING, allowNull: false, references: { model: Task, key: 'id' } },
        file_name: { type: DataTypes.STRING, allowNull: false },
        file_data: { type: DataTypes.BLOB, allowNull: false },
        created_at: { type: DataTypes.DATE },
    },
    {
        sequelize,
        tableName: 'files',
        timestamps: false,
        underscored: true
    }
);

export default File;