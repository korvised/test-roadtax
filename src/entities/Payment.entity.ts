import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { FeeEntity as Fee } from "./Fee.entity"

@Entity({ name: "payments" })
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column({ nullable: false })
  transId: string

  @Column({ type: "float" })
  amount: number

  @ManyToOne(() => Fee, (fee) => fee.payments)
  fee: Fee

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date
}
