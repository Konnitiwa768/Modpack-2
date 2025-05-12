// 落下ダメージを受けた時に Vantair を召喚
ServerEvents.playerDamaged(event => {
  const { player, damageSource, damage } = event;
  if (damageSource.isFall() && damage >= 10) {
    const level = player.level;
    if (!level.isClientSide) {
      level.server.runCommandSilent(`summon lycanitesmobs:vantair ${player.x} ${player.y + 2} ${player.z}`);
    }
  }
});
