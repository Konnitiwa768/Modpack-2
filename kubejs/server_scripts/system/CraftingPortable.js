ItemEvents.rightClicked(event => {
  if (event.item.id === 'minecraft:crafting_table') {
    event.player.openScreen('minecraft:crafting_table')
  }
})
