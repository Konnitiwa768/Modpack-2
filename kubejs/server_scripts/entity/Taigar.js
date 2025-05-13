// Taigar召喚：トウヒの原木を壊した時、1%で出現
BlockEvents.broken(event => {
  if (event.block.id === 'minecraft:spruce_log' && Math.random() < 0.01) {
    const { x, y, z, server } = event.block
    const taigar = server.runCommandSilent(`summon lycanitesmobs:reiver ${x} ${y + 1} ${z} {CustomName:'"Taigar"',Tags:["taigar_boss"],Health:30.0}`)

    event.server.scheduleInTicks(20, () => {
      let target = event.player
      if (target) {
        taigar.setAttackTarget(target)
      }
    })
  }
})

// Taigar能力設定
EntityEvents.spawned(event => {
  if (!event.entity || !event.entity.hasTag('taigar_boss')) return

  const taigar = event.entity

  // ステータス設定
  taigar.getAttribute('minecraft:generic.max_health').baseValue = 30
  taigar.health = 30
  taigar.getAttribute('minecraft:generic.attack_damage').baseValue = 5
  taigar.getAttribute('minecraft:generic.attack_speed').baseValue = 1

  // 定期的に4方向に氷弾を発射
  event.server.scheduleRepeatingInTicks(50, e => {
    if (!taigar.isAlive()) {
      e.cancel()
      return
    }

    const directions = [
      [1, 0], [-1, 0], [0, 1], [0, -1]
    ]

    directions.forEach(dir => {
      taigar.level.server.runCommandSilent(
        `summon lycanitesmobs:frostboltcharge ${taigar.x + dir[0]} ${taigar.y + 1} ${taigar.z + dir[1]} {ownerUUID:"${taigar.uuid}",damage:1.0,Tags:["taigar_bullet"]}`
      )
    })
  })

  // プレイヤーをトウヒで囲む技（20秒ごと）
  event.server.scheduleRepeatingInTicks(400, e => {
    if (!taigar.isAlive()) {
      e.cancel()
      return
    }

    const target = taigar.getAttackTarget()
    if (target) {
      const { x, y, z } = target.blockPosition()

      // プレイヤーの周囲を囲む
      const positions = [
        [x + 1, y, z], [x - 1, y, z],
        [x, y, z + 1], [x, y, z - 1],
        [x + 1, y, z + 1], [x - 1, y, z - 1],
        [x + 1, y, z - 1], [x - 1, y, z + 1]
      ]

      positions.forEach(pos => {
        taigar.level.setBlock(pos[0], pos[1], pos[2], 'minecraft:spruce_log')
      })
    }
  })
})
