import { DataTypes, Model } from "sequelize";
import sequelize from '../config/database';

class Account extends Model {
    public id!: string;
    public username!: string;
    public password?: string;
    public active_token!: Buffer;
    public profile_pic!: Buffer;
    public active_sign_in!: string;
    public created_at!: Date;
    public updated_at!: Date;
    public google_id?: string;
}

Account.init(
    {
        id: { type: DataTypes.STRING(50), primaryKey: true },
        username: { type: DataTypes.STRING(50), allowNull: false },
        password: { type: DataTypes.STRING(255), allowNull: true },
        active_token: { type: DataTypes.BLOB },
        profile_pic: { type: DataTypes.BLOB },
        active_sign_in: { type: DataTypes.STRING(50) },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        google_id: { 
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
    },
    { sequelize, tableName: "account", modelName: "Account", underscored: true }
);

export default Account;