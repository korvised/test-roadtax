import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm"
import { PaymentEntity as Payment } from "./Payment.entity"
import { ProvinceEntity as Province } from "./Province.entity"

@Entity({ name: "fees" })
export class FeeEntity {
  @PrimaryColumn({ nullable: false })
  ref: string

  @Column({ nullable: false })
  plateNo: string

  @Column({ nullable: false })
  year: number

  @ManyToOne(() => Province, (province) => province.fees)
  province: Province

  @Column({ type: "float", nullable: false })
  feeAmount: number

  @Column({ type: "float", nullable: false })
  fineAmount: number

  @Column({ default: false })
  isPaid: boolean

  @OneToMany(() => Payment, (payment) => payment.fee)
  payments: Payment[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn({ select: false })
  updatedAt: Date
}
