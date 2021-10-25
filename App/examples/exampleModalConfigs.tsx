<CharacterModal id="levelUp" modalOpen={state.modalQueue[0] === "levelUp"} speech="Hooo! I'm here to whip you into shape in the mobile App too.">
        <ActionHeader type="warning" text="Warning!" />
        <BodyContent>
          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</Text>
        </BodyContent>
      </CharacterModal>

      <BasicModal id="patchUpdate" modalOpen={state.modalQueue[0] === "patchUpdate"} title="BIG SURPRISE!">
        <BodyContent>
          <Text>THE CONTENT</Text>
        </BodyContent>
      </BasicModal>

      <FeedbackModal id="feedback" modalOpen={state.modalQueue[0] === "feedback"} title="Quick Question">
        <FeedbackChoiceForm id="feedback" title={"How would you feel if you could never play HeroFit again?"} postSubmitAction={() => formActionHappens("feedback")} />
      </FeedbackModal>

      <ItemModal id={id} modalOpen={state.modalQueue[0] === id} buttonText="OK" modalAction={modalAction} item={item} character={character}>
        <BodyContent>
          {item.effects?.length && !item.lore && (
            <Text fontFamily="heading" fontSize="3xl" mb={3}>
              Effects
            </Text>
          )}
          <FlatList data={item.effects} renderItem={({ item }) => _renderEffect(item)} keyExtractor={(item, i) => i.toString()} />
        </BodyContent>
      </ItemModal>