'use strict'

export type UserRole = 'USER' | 'ADMIN'
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED'
export type TradeSide = 'BUY' | 'SELL'
export type PositionStatus = 'OPEN' | 'CLOSED' | 'STOPPED'
export type TransactionType =
  | 'DEPOSIT'
  | 'WITHDRAWAL'
  | 'CREDIT'
  | 'ADJUSTMENT'
  | 'TRADE_PROFIT'
  | 'TRADE_LOSS'
export type GameModeActionType = 'FORCE_WIN' | 'FORCE_LOSS' | 'FORCE_PRICE' | 'VOLATILITY' | 'SCENARIO'
export type DepositStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

