
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';

import { Device } from '../../devices/entities/device.entity';

export type GatewayDocument = HydratedDocument<Gateway>;

@Schema({ timestamps: true })
export class Gateway {
    @Prop({ required: true, unique: true })
    serialId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    ipv4Address: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Device' }], default: []})
    peripheralDevices: Device[];
}

export const GatewaySchema = SchemaFactory.createForClass(Gateway);